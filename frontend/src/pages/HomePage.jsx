import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { MessageCircle, Users } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

const HomePage = () => {
	const { data: authUser } = useAuth();
	const [showMore, setShowMore] = useState(false);

	const handleShowMore = () => {
		setShowMore(!showMore);
	};

	const { data: recommendedUsers } = useQuery({
		queryKey: ["recommendedUsers"],
		queryFn: async () => {
			const res = await axiosInstance.get("/users/suggestions");
			return res.data;
		},
	});

	const { data: posts } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			const res = await axiosInstance.get("/posts");
			return res.data;
		},
	});

	return (
		<div className='grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto py-6'>
			<div className='hidden lg:block lg:col-span-1'>
				<Sidebar user={authUser} />
				{/* News section (LinkedIn-style) */}
				<div className="bg-white rounded-lg shadow-md mt-4 overflow-hidden transition-all duration-300 hover:shadow-lg">
					<div className="p-4 border-b border-gray-200">
						<h2 className="font-semibold text-lg text-gray-800">LinkedIn News</h2>
					</div>
					<div className="p-4">
						<ul className="space-y-3">
							{[1, 2, 3].map((item) => (
								<li key={item} className="group">
									<a href="#" className="flex items-start space-x-3 group-hover:text-blue-600 transition-colors duration-200">
										<span className="text-xs mt-1 font-bold">•</span>
										<div>
											<p className="font-medium text-sm text-gray-800 group-hover:text-blue-600">Top news story {item}: Professional networking trends in 2025</p>
											<p className="text-xs text-gray-500 mt-1">3d ago • 1,234 readers</p>
										</div>
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			<div className='col-span-1 lg:col-span-2 order-first lg:order-none space-y-4'>
				<PostCreation user={authUser} />
				{posts?.map((post) => (
					<Post key={post._id} post={post} />
				))}
				{posts?.length === 0 && (
					<div className='bg-white rounded-lg shadow-md p-8 text-center transition-all duration-300 hover:shadow-lg'>
						<div className='mb-6 bg-blue-50 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto'>
							<Users size={48} className='text-blue-500' />
						</div>
						<h2 className='text-2xl font-bold mb-4 text-gray-800'>No Posts Yet</h2>
						<p className='text-gray-600 mb-6'>Connect with others to start seeing posts in your feed!</p>
						<button className='btn btn-primary rounded-full px-6 py-2 transition-all duration-300 hover:shadow-md'>
							<MessageCircle size={18} className="mr-2" /> Find Connections
						</button>
					</div>
				)}
			</div>

			{Array.isArray(recommendedUsers) && recommendedUsers.length > 0 && (
				<div className='col-span-1 lg:col-span-1 hidden lg:block'>
					<div className='bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg'>
						<h2 className='font-semibold text-lg text-gray-800 mb-4 border-b border-gray-200 pb-2'>People you may know</h2>
						<div className="space-y-4">
							{recommendedUsers.slice(0, showMore ? recommendedUsers.length : 5).map((user) => (
								<RecommendedUser key={user._id} user={user} />
							))}
						</div>
						{recommendedUsers.length > 5 && (
							<button 
								className="text-blue-600 font-medium mt-4 hover:text-blue-800 transition-colors duration-200 text-sm w-full text-center"
								onClick={handleShowMore}
							>
								{showMore ? "Show less" : "Show more"}
							</button>
						)}
					</div>
					{/* Footer - LinkedIn style */}
					<div className="mt-4 p-4">
						<div className="flex flex-wrap text-xs text-gray-500 gap-2">
							<a href="#" className="hover:text-blue-600 hover:underline">About</a>
							<a href="#" className="hover:text-blue-600 hover:underline">Accessibility</a>
							<a href="#" className="hover:text-blue-600 hover:underline">Help Center</a>
							<a href="#" className="hover:text-blue-600 hover:underline">Privacy & Terms</a>
							<a href="#" className="hover:text-blue-600 hover:underline">Ad Choices</a>
						</div>
						<p className="text-xs text-gray-500 mt-2">LinkedIn Clone © 2025</p>
					</div>
				</div>
			)}
		</div>
	);
};
export default HomePage;