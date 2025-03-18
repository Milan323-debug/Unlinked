import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

import { Camera, Clock, MapPin, UserCheck, UserPlus, X } from "lucide-react";
import { useAuth } from '../hooks/useAuth';

const ProfileHeader = ({ userData, onSave, isOwnProfile }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState({
		name: userData?.name || '',
		headline: userData?.headline || '',
		location: userData?.location || '', // Ensure location is included
		profilePicture: userData?.profilePicture || '',
		bannerImg: userData?.bannerImg || '',
	});
	const queryClient = useQueryClient();

	const { data: authUser } = useAuth();

	const { data: connectionStatus, refetch: refetchConnectionStatus } = useQuery({
		queryKey: ["connectionStatus", userData._id],
		queryFn: () => axiosInstance.get(`/connections/status/${userData._id}`),
		enabled: !isOwnProfile,
	});

	const isConnected = userData.connections.some((connection) => connection === authUser._id);

	const { mutate: sendConnectionRequest } = useMutation({
		mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
		onSuccess: () => {
			toast.success("Connection request sent");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: acceptRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request accepted");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: rejectRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request rejected");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: removeConnection } = useMutation({
		mutationFn: (userId) => axiosInstance.delete(`/connections/${userId}`),
		onSuccess: () => {
			toast.success("Connection removed");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const getConnectionStatus = useMemo(() => {
		if (isConnected) return "connected";
		if (!isConnected) return "not_connected";
		return connectionStatus?.data?.status;
	}, [isConnected, connectionStatus]);

	// Update editedData when userData changes
	useEffect(() => {
		if (userData) {
			setEditedData({
				name: userData.name || '',
				headline: userData.headline || '',
				location: userData.location || '',
				profilePicture: userData.profilePicture || '',
				bannerImg: userData.bannerImg || '',
			});
		}
	}, [userData]);

	const renderConnectionButton = () => {
		const baseClass = "text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center";
		switch (getConnectionStatus) {
			case "connected":
				return (
					<div className='flex gap-2 justify-center'>
						<div className={`${baseClass} bg-green-500 hover:bg-green-600`}>
							<UserCheck size={20} className='mr-2' />
							Connected
						</div>
						<button
							className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm`}
							onClick={() => removeConnection(userData._id)}
						>
							<X size={20} className='mr-2' />
							Remove Connection
						</button>
					</div>
				);

			case "pending":
				return (
					<button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
						<Clock size={20} className='mr-2' />
						Pending
					</button>
				);

			case "received":
				return (
					<div className='flex gap-2 justify-center'>
						<button
							onClick={() => acceptRequest(connectionStatus.data.requestId)}
							className={`${baseClass} bg-green-500 hover:bg-green-600`}
						>
							Accept
						</button>
						<button
							onClick={() => rejectRequest(connectionStatus.data.requestId)}
							className={`${baseClass} bg-red-500 hover:bg-red-600`}
						>
							Reject
						</button>
					</div>
				);
			default:
				return (
					<button
						onClick={() => sendConnectionRequest(userData._id)}
						className='bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center'
					>
						<UserPlus size={20} className='mr-2' />
						Connect
					</button>
				);
		}
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setEditedData((prev) => ({ ...prev, [event.target.name]: reader.result }));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSave = async () => {
		// Ensure all fields are included in the update
		const dataToSave = {
			name: editedData.name || userData?.name || '',
			headline: editedData.headline || userData?.headline || '',
			location: editedData.location,  // Don't fallback for location to ensure empty string is sent
			profilePicture: editedData.profilePicture || userData?.profilePicture || '',
			bannerImg: editedData.bannerImg || userData?.bannerImg || '',
		};
		
		await onSave(dataToSave);
		setIsEditing(false);
		
		// Force a refetch of user data
		queryClient.invalidateQueries(["userProfile"]);
		queryClient.invalidateQueries(["authUser"]);
	};

	const handleCancel = () => {
		setEditedData({
			name: userData?.name || '',
			headline: userData?.headline || '',
			location: userData?.location || '',
			profilePicture: userData?.profilePicture || '',
			bannerImg: userData?.bannerImg || '',
		});
		setIsEditing(false);
	};

	return (
		<div className='bg-white shadow-lg rounded-lg mb-6 border border-gray-200'>
			<div
				className='relative h-48 rounded-t-lg bg-cover bg-center'
				style={{
					backgroundImage: `url('${editedData.bannerImg || userData?.bannerImg || "/banner.png"}')`,
				}}
			>
				{isEditing && (
					<label className='absolute top-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:shadow-lg transition-shadow'>
						<Camera size={20} />
						<input
							type='file'
							className='hidden'
							name='bannerImg'
							onChange={handleImageChange}
							accept='image/*'
						/>
					</label>
				)}
			</div>

			<div className='p-4'>
				<div className='relative -mt-20 mb-4'>
					<div className='w-32 h-32 mx-auto rounded-full border-4 border-white shadow-lg'>
						<img
							className='w-full h-full rounded-full object-cover'
							src={editedData.profilePicture || userData?.profilePicture || "/avatar.png"}
							alt={userData?.name}
						/>
					</div>

					{isEditing && (
						<label className='absolute bottom-0 right-1/2 transform translate-x-16 bg-white p-2 rounded-full shadow-md cursor-pointer hover:shadow-lg transition-shadow'>
							<Camera size={20} />
							<input
								type='file'
								className='hidden'
								name='profilePicture'
								onChange={handleImageChange}
								accept='image/*'
							/>
						</label>
					)}
				</div>

				<div className='text-center mb-4'>
					{isEditing ? (
						<input
							type='text'
							value={editedData.name || ''}
							onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
							className='text-2xl font-bold mb-2 text-center w-full input input-bordered'
							placeholder="Your name"
						/>
					) : (
						<h1 className='text-2xl font-bold mb-2'>{userData?.name}</h1>
					)}

					{isEditing ? (
						<input
							type='text'
							value={editedData.headline || ''}
							onChange={(e) => setEditedData({ ...editedData, headline: e.target.value })}
							className='text-gray-600 text-center w-full input input-bordered'
							placeholder="Your headline"
						/>
					) : (
						<p className='text-gray-600'>{userData?.headline}</p>
					)}

					<div className='flex justify-center items-center mt-2'>
						<MapPin size={16} className='text-gray-500 mr-1' />
						{isEditing ? (
							<input
								type='text'
								value={editedData.location}
								onChange={(e) => setEditedData(prev => ({ ...prev, location: e.target.value }))}
								className='text-gray-600 text-center input input-bordered w-48'
								placeholder="Your location"
							/>
						) : (
							<span className='text-gray-600'>
								{userData?.location ? userData.location : 'Add location'}
							</span>
						)}
					</div>
				</div>

				{isOwnProfile ? (
					isEditing ? (
						<button
							className='w-full bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark
							 transition duration-300'
							onClick={handleSave}
						>
							Save Profile
						</button>
					) : (
						<button
							onClick={() => setIsEditing(true)}
							className='w-full bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark
							 transition duration-300'
						>
							Edit Profile
						</button>
					)
				) : (
					<div className='flex justify-center'>{renderConnectionButton()}</div>
				)}
			</div>
		</div>
	);
};

export default ProfileHeader;
