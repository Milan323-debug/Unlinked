import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader, Video, X } from "lucide-react";

const PostCreation = ({ user }) => {
	const [content, setContent] = useState("");
	const [media, setMedia] = useState(null);
	const [mediaPreview, setMediaPreview] = useState(null);
	const [mediaType, setMediaType] = useState('none');

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

	return (
		<div className='bg-secondary rounded-lg shadow mb-4 p-4'>
			<div className='flex space-x-3'>
				<img 
					src={user.profilePicture || "/avatar.png"} 
					alt={user.name} 
					className='size-12 rounded-full' 
				/>
				<textarea
					placeholder="What's on your mind?"
					className='w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]'
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
			</div>

			{mediaPreview && (
				<div className='mt-4 relative'>
					<button
						onClick={removeMedia}
						className='absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200'
					>
						<X size={20} />
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

			<div className='flex justify-between items-center mt-4'>
				<div className='flex space-x-4'>
					<label className='flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer'>
						<Image size={20} className='mr-2' />
						<span>Photo</span>
						<input 
							type='file' 
							accept='image/*' 
							className='hidden' 
							onChange={(e) => handleMediaChange(e, 'image')} 
							disabled={mediaType !== 'none'}
						/>
					</label>
					<label className='flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer'>
						<Video size={20} className='mr-2' />
						<span>Video</span>
						<input 
							type='file' 
							accept='video/*' 
							className='hidden' 
							onChange={(e) => handleMediaChange(e, 'video')} 
							disabled={mediaType !== 'none'}
						/>
					</label>
				</div>

				<button
					className='bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
					onClick={handlePostCreation}
					disabled={isPending || (!content.trim() && !media)}
				>
					{isPending ? <Loader className='size-5 animate-spin' /> : "Share"}
				</button>
			</div>
		</div>
	);
};

export default PostCreation;