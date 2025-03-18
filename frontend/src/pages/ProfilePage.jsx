import React from 'react';
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import SkillsSection from "../components/SkillsSection";

const ProfilePage = () => {
	const { username } = useParams();
	const queryClient = useQueryClient();

	const { data: authUser, isLoading: authLoading } = useAuth();

	const { data: userProfile, isLoading: profileLoading } = useQuery({
		queryKey: ["userProfile", username],
		queryFn: async () => {
			const res = await axiosInstance.get(`/users/${username}`);
			return res.data;
		},
		enabled: !!username,
	});

	const { mutate: updateProfile, isLoading: isUpdating } = useMutation({
		mutationFn: async (updatedData) => {
			const res = await axiosInstance.put("/users/profile", updatedData);
			return res.data;
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			// Invalidate both profile queries to ensure data is fresh
			queryClient.invalidateQueries(["authUser"]);
			queryClient.invalidateQueries(["userProfile", username]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "Failed to update profile");
		},
	});

	if (authLoading || profileLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="loading loading-spinner loading-lg"></div>
			</div>
		);
	}

	if (!userProfile) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-xl">User not found</div>
			</div>
		);
	}

	const isOwnProfile = authUser?.username === userProfile.username;
	const userData = isOwnProfile ? authUser : userProfile;

	const handleSave = (updatedData) => {
		updateProfile(updatedData);
	};

	return (
		<div className='max-w-4xl mx-auto p-4'>
			<ProfileHeader 
				userData={userData} 
				isOwnProfile={isOwnProfile} 
				onSave={handleSave}
			/>
			<AboutSection 
				userData={userData} 
				isOwnProfile={isOwnProfile} 
				onSave={handleSave}
			/>
			<ExperienceSection 
				userData={userData} 
				isOwnProfile={isOwnProfile} 
				onSave={handleSave}
			/>
			<EducationSection 
				userData={userData} 
				isOwnProfile={isOwnProfile} 
				onSave={handleSave}
			/>
			<SkillsSection 
				userData={userData} 
				isOwnProfile={isOwnProfile} 
				onSave={handleSave}
			/>
		</div>
	);
};

export default ProfilePage;