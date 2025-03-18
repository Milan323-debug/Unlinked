import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Calendar, Image, Loader, Video, X, FileText, BriefcaseBusiness } from "lucide-react";

const PostCreation = ({ user }) => {
	const [content, setContent] = useState("");
	const [media, setMedia] = useState(null);
	const [mediaPreview, setMediaPreview] = useState(null);
	const [mediaType, setMediaType] = useState('none');
	const [isExpanded, setIsExpanded] = useState(false);

	const queryClient = useQueryClient();

	const { mutate: createPostMutation, isPending } = useMutation({
		mutationFn: async (postData) => {
			const res = await axiosInstance.post("/posts/create", postData, {
				headers: { "Content-Type": "application/json" },
			});
			return res.data;
		},
		onSuccess: () => {
			resetForm();
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (err) => {
			toast.error(err.response?.data?.message || "Failed to create post");
		},
	});

	const handlePostCreation = async () => {
		try {
			const postData = { 
				content,
				mediaType
			};

			if (media) {
				const dataUrl = await readFileAsDataURL(media);
				if (mediaType === 'image') {
					postData.image = dataUrl;
				} else if (mediaType === 'video') {
					postData.video = dataUrl;
				}
			}

			createPostMutation(postData);
		} catch (error) {
			console.error("Error in handlePostCreation:", error);
			toast.error("Error creating post");
		}
	};

	const resetForm = () => {
		setContent("");
		setMedia(null);
		setMediaPreview(null);
		setMediaType('none');
		setIsExpanded(false);
	};

	const handleMediaChange = async (e, type) => {
		const file = e.target.files[0];
		if (!file) return;

		// Validate file size (10MB for images, 50MB for videos)
		const maxSize = type === 'image' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
		if (file.size > maxSize) {
			toast.error(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
			return;
		}

		setMedia(file);
		setMediaType(type);
		setIsExpanded(true);

		// Create preview
		if (type === 'image') {
			const dataUrl = await readFileAsDataURL(file);
			setMediaPreview(dataUrl);
		} else if (type === 'video') {
			const videoUrl = URL.createObjectURL(file);
			setMediaPreview(videoUrl);
		}
	};

	const removeMedia = () => {
		setMedia(null);
		setMediaPreview(null);
		setMediaType('none');
		if (mediaType === 'video' && mediaPreview) {
			URL.revokeObjectURL(mediaPreview);
		}
	};

	const readFileAsDataURL = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

	const expandTextArea = () => {
		setIsExpanded(true);
	};

	return (
		<div className='bg-white rounded-lg shadow-md mb-4 overflow-hidden transition-all duration-300 hover:shadow-lg'>
			{/* Post creation header */}
			<div className='px-4 py-3 border-b border-gray-200'>
				<h3 className='text-lg font-medium text-gray-900'>Create a post</h3>
			</div>
			
			{/* Post input area */}
			<div className='p-4'>
				<div className='flex space-x-3'>
					<img 
						src={user.profilePicture || "/avatar.png"} 
						alt={user.name} 
						className='size-12 rounded-full border-2 border-white shadow-sm' 
					/>
					<div className="flex-grow">
						<textarea
							placeholder="What's on your mind?"
							className={`w-full p-3 rounded-lg bg-gray-50 hover:bg-gray-100 focus:bg-white focus:outline-none resize-none transition-all duration-200 border border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 ${
								isExpanded ? 'min-h-[120px]' : 'min-h-[60px]'
							}`}
							value={content}
							onChange={(e) => setContent(e.target.value)}
							onClick={expandTextArea}
						/>
					</div>
				</div>

				{mediaPreview && (
					<div className='mt-4 relative rounded-lg overflow-hidden border border-gray-200'>
						<button
							onClick={removeMedia}
							className='absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-100 transition-all duration-200 z-10'
						>
							<X size={18} />
						</button>
						{mediaType === 'image' ? (
							<img 
								src={mediaPreview} 
								alt='Selected' 
								className='w-full h-auto rounded-lg' 
							/>
						) : (
							<video 
								src={mediaPreview} 
								controls 
								className='w-full h-auto rounded-lg'
							>
								Your browser does not support the video tag.
							</video>
						)}
					</div>
				)}

				{isExpanded && (
					<div className="mt-4 text-sm text-gray-500">
						<p>Add hashtags or mention people with @</p>
					</div>
				)}
			</div>

			{/* Action buttons */}
			<div className='flex flex-wrap bg-gray-50 p-2 border-t border-gray-200'>
				<div className='flex flex-wrap ml-2'>
					<label className='flex items-center m-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer'>
						<div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 mr-2 group-hover:bg-blue-100 transition-colors duration-200">
							<Image size={18} className='text-blue-600' />
						</div>
						<span>Photo</span>
						<input 
							type='file' 
							accept='image/*' 
							className='hidden' 
							onChange={(e) => handleMediaChange(e, 'image')} 
							disabled={mediaType !== 'none'}
						/>
					</label>
					<label className='flex items-center m-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer'>
						<div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-50 mr-2 group-hover:bg-green-100 transition-colors duration-200">
							<Video size={18} className='text-green-600' />
						</div>
						<span>Video</span>
						<input 
							type='file' 
							accept='video/*' 
							className='hidden' 
							onChange={(e) => handleMediaChange(e, 'video')} 
							disabled={mediaType !== 'none'}
						/>
					</label>
					<label className='flex items-center m-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer'>
						<div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-50 mr-2">
							<Calendar size={18} className='text-orange-600' />
						</div>
						<span>Event</span>
					</label>
					<label className='flex items-center m-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer'>
						<div className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-50 mr-2">
							<FileText size={18} className='text-pink-600' />
						</div>
						<span>Article</span>
					</label>
				</div>

				<div className="ml-auto flex items-center pr-3">
					<button
						className={`rounded-full px-6 py-2 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
							!content.trim() && !media
								? 'bg-gray-300 cursor-not-allowed'
								: 'bg-blue-600 hover:bg-blue-700'
						}`}
						onClick={handlePostCreation}
						disabled={isPending || (!content.trim() && !media)}
					>
						{isPending ? <Loader className='size-5 animate-spin' /> : "Post"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default PostCreation;