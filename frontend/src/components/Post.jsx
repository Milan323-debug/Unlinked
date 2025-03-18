import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { Loader, MessageCircle, MoreHorizontal, Send, Share2, ThumbsUp, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../hooks/useAuth";

import PostAction from "./PostAction";

const Post = ({ post }) => {
	const { postId } = useParams();

	const { data: authUser } = useAuth();
	const [showComments, setShowComments] = useState(false);
	const [newComment, setNewComment] = useState("");
	const [comments, setComments] = useState(post.comments || []);
	const [showOptions, setShowOptions] = useState(false);
	const isOwner = authUser._id === post.author._id;
	const isLiked = post.likes.includes(authUser._id);

	const queryClient = useQueryClient();

	const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
		mutationFn: async () => {
			await axiosInstance.delete(`/posts/delete/${post._id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			toast.success("Post deleted successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: createComment, isPending: isAddingComment } = useMutation({
		mutationFn: async (newComment) => {
			await axiosInstance.post(`/posts/${post._id}/comment`, { content: newComment });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			toast.success("Comment added successfully");
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Failed to add comment");
		},
	});

	const { mutate: likePost, isPending: isLikingPost } = useMutation({
		mutationFn: async () => {
			await axiosInstance.post(`/posts/${post._id}/like`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["post", postId] });
		},
	});

	const handleDeletePost = () => {
		if (!window.confirm("Are you sure you want to delete this post?")) return;
		deletePost();
	};

	const handleLikePost = async () => {
		if (isLikingPost) return;
		likePost();
	};

	const handleAddComment = async (e) => {
		e.preventDefault();
		if (newComment.trim()) {
			createComment(newComment);
			setNewComment("");
			setComments([
				...comments,
				{
					content: newComment,
					user: {
						_id: authUser._id,
						name: authUser.name,
						profilePicture: authUser.profilePicture,
					},
					createdAt: new Date(),
				},
			]);
		}
	};

	const renderMedia = () => {
		if (post.mediaType === 'image' && post.image) {
			return <img src={post.image} alt='Post content' className='rounded-lg w-full mb-4 transition-all duration-300 hover:brightness-95' />;
		} else if (post.mediaType === 'video' && post.video) {
			return (
				<video 
					src={post.video} 
					controls 
					className='rounded-lg w-full mb-4 transition-all duration-300 hover:brightness-95'
					preload="metadata"
				>
					Your browser does not support the video tag.
				</video>
			);
		}
		return null;
	};

	return (
		<div className='bg-white rounded-lg shadow-md mb-4 overflow-hidden transition-all duration-300 hover:shadow-lg'>
			<div className='p-4'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center'>
						<Link to={`/profile/${post?.author?.username}`}>
							<img
								src={post.author.profilePicture || "/avatar.png"}
								alt={post.author.name}
								className='size-12 rounded-full mr-3 border-2 border-white shadow-sm hover:shadow-md transition-all duration-300'
							/>
						</Link>

						<div>
							<Link to={`/profile/${post?.author?.username}`}>
								<h3 className='font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200'>{post.author.name}</h3>
							</Link>
							<p className='text-xs text-gray-500'>{post.author.headline}</p>
							<p className='text-xs text-gray-500 flex items-center'>
								{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
								<span className="mx-1">•</span>
								<span className="inline-block w-4 h-4 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" width="12" height="12">
										<path d="M8 1a7 7 0 107 7 7 7 0 00-7-7zM3 8a5 5 0 011-3l.55.55A1.5 1.5 0 015 6.62v1.07a.75.75 0 00.22.53l.56.56a.75.75 0 00.53.22H7v.69a.75.75 0 00.22.53l.56.56a.75.75 0 01.22.53V13a5 5 0 01-5-5zm6.24 4.83l2-2.46a.75.75 0 00.09-.8l-.58-1.16A.76.76 0 0010 8H7v-.19a.51.51 0 01.28-.45l.38-.19a.74.74 0 01.68 0l.38.19c.2.1.39.26.39.45V8h3a.76.76 0 00.75-.75.75.75 0 00-.75-.75h-1v-.19a.51.51 0 01.28-.45l.38-.19a.74.74 0 01.68 0l.38.19c.2.1.39.26.39.45V6h.75a.75.75 0 00.75-.75A.76.76 0 0013 4.5h-1V3a5 5 0 00-5 5v3.31l.4-.4a.75.75 0 011.06 0l.7.7z"></path>
									</svg>
								</span>
							</p>
						</div>
					</div>
					<div className="relative">
						<button 
							onClick={() => setShowOptions(!showOptions)} 
							className='text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 p-2 transition-all duration-200'
						>
							<MoreHorizontal size={20} />
						</button>
						
						{showOptions && isOwner && (
							<div className="absolute right-0 top-full mt-2 bg-white shadow-md rounded-md py-1 z-10 min-w-40 border border-gray-200">
								<button 
									onClick={() => {
										setShowOptions(false);
										handleDeletePost();
									}} 
									className='w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 flex items-center'
								>
									{isDeletingPost ? <Loader size={16} className='animate-spin mr-2' /> : <Trash2 size={16} className="mr-2" />}
									Delete post
								</button>
							</div>
						)}
					</div>
				</div>
				
				<p className='mb-4 text-gray-800 whitespace-pre-line'>{post.content}</p>
				
				{renderMedia()}

				{post.likes.length > 0 && (
					<div className="flex items-center mb-2 text-xs text-gray-500">
						<span className="bg-blue-100 rounded-full p-1 mr-1">
							<ThumbsUp size={12} className="text-blue-600 fill-blue-100" />
						</span>
						<span>{post.likes.length} {post.likes.length === 1 ? 'person' : 'people'} liked this</span>
					</div>
				)}

				<div className='flex justify-between text-gray-500 border-t border-b border-gray-200 py-1 mt-1'>
					<PostAction
						icon={<ThumbsUp size={18} className={isLiked ? "text-blue-600 fill-blue-100" : ""} />}
						text={isLiked ? "Liked" : "Like"}
						onClick={handleLikePost}
						active={isLiked}
					/>

					<PostAction
						icon={<MessageCircle size={18} />}
						text="Comment"
						onClick={() => setShowComments(!showComments)}
						active={showComments}
					/>
					
					<PostAction 
						icon={<Share2 size={18} />} 
						text='Share' 
					/>
				</div>
			</div>

			{showComments && (
				<div className='px-4 pb-4 bg-gray-50 border-t border-gray-200'>
					<div className='mb-4 max-h-60 overflow-y-auto'>
						{comments.length === 0 ? (
							<p className="text-center text-gray-500 py-4 text-sm">No comments yet. Be the first to comment!</p>
						) : (
							comments.map((comment) => (
								<div key={comment._id} className='mb-3 p-3 rounded-lg flex items-start bg-white shadow-sm hover:shadow transition-shadow duration-200'>
									<Link to={`/profile/${comment.user.username || 'user'}`}>
										<img
											src={comment.user.profilePicture || "/avatar.png"}
											alt={comment.user.name}
											className='w-10 h-10 rounded-full mr-3 flex-shrink-0 border-2 border-white'
										/>
									</Link>
									<div className='flex-grow'>
										<div className='flex items-center mb-1'>
											<Link to={`/profile/${comment.user.username || 'user'}`} className="hover:text-blue-600 transition-colors duration-200">
												<span className='font-semibold mr-2 text-gray-900'>{comment.user.name}</span>
											</Link>
											<span className='text-xs text-gray-500'>
												{formatDistanceToNow(new Date(comment.createdAt))}
											</span>
										</div>
										<p className="text-gray-800">{comment.content}</p>
									</div>
								</div>
							))
						)}
					</div>

					<form onSubmit={handleAddComment} className='flex items-center'>
						<img
							src={authUser.profilePicture || "/avatar.png"}
							alt={authUser.name}
							className='w-8 h-8 rounded-full mr-2 flex-shrink-0 border border-gray-200'
						/>
						<input
							type='text'
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder='Add a comment...'
							className='flex-grow p-3 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
						/>

						<button
							type='submit'
							className='ml-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:bg-blue-400'
							disabled={isAddingComment || !newComment.trim()}
						>
							{isAddingComment ? <Loader size={18} className='animate-spin' /> : <Send size={18} />}
						</button>
					</form>
				</div>
			)}
		</div>
	);
};
export default Post;