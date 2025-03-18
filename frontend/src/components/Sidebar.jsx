import { Link } from "react-router-dom";
import { BookmarkPlus, Home, MessageSquare, Users, UserPlus, Bell, Briefcase } from "lucide-react";

export default function Sidebar({ user }) {
	return (
		<div className='bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg'>
			{/* Profile summary section */}
			<div className='relative'>
				{/* Banner image */}
				<div
					className='h-24 bg-cover bg-center'
					style={{
						backgroundImage: `url("${user.bannerImg || "/banner.png"}")`,
					}}
				/>
				
				{/* Profile image */}
				<Link to={`/profile/${user.username}`} className="block relative">
					<img
						src={user.profilePicture || "/avatar.png"}
						alt={user.name}
						className='w-24 h-24 rounded-full border-4 border-white mx-auto absolute left-0 right-0 -bottom-12 shadow-md hover:shadow-lg transition-all duration-300'
					/>
				</Link>
			</div>
			
			{/* User info */}
			<div className='text-center pt-14 pb-3 px-4 border-b border-gray-200'>
				<Link to={`/profile/${user.username}`} className="inline-block group">
					<h2 className='text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200'>{user.name}</h2>
				</Link>
				<p className='text-gray-500 text-sm mt-1'>{user.headline || "Add a headline"}</p>
			</div>
			
			{/* Stats */}
			<div className='border-b border-gray-200'>
				<Link to={`/network`} className="flex justify-between items-center p-3 hover:bg-gray-50 transition-all duration-200 group">
					<span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-200">Connections</span>
					<span className="font-semibold text-blue-600">{user.connections?.length || 0}</span>
				</Link>
				<Link to={`/profile/${user.username}#views`} className="flex justify-between items-center p-3 hover:bg-gray-50 transition-all duration-200 group">
					<span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-200">Profile views</span>
					<span className="font-semibold text-blue-600">{Math.floor(Math.random() * 100)}</span>
				</Link>
			</div>
			
			{/* Navigation */}
			<div className='p-2'>
				<nav>
					<ul className='space-y-1'>
						<li>
							<Link
								to='/'
								className='flex items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-all duration-200 text-gray-700 hover:text-gray-900 group'
							>
								<Home className='mr-3 text-gray-500 group-hover:text-blue-600 transition-colors duration-200' size={20} />
								<span>Home</span>
							</Link>
						</li>
						<li>
							<Link
								to='/network'
								className='flex items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-all duration-200 text-gray-700 hover:text-gray-900 group'
							>
								<UserPlus className='mr-3 text-gray-500 group-hover:text-blue-600 transition-colors duration-200' size={20} />
								<span>My Network</span>
							</Link>
						</li>
						<li>
							<Link
								to='/jobs'
								className='flex items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-all duration-200 text-gray-700 hover:text-gray-900 group'
							>
								<Briefcase className='mr-3 text-gray-500 group-hover:text-blue-600 transition-colors duration-200' size={20} />
								<span>Jobs</span>
							</Link>
						</li>
						<li>
							<Link
								to='/messaging'
								className='flex items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-all duration-200 text-gray-700 hover:text-gray-900 group'
							>
								<MessageSquare className='mr-3 text-gray-500 group-hover:text-blue-600 transition-colors duration-200' size={20} />
								<span>Messaging</span>
							</Link>
						</li>
						<li>
							<Link
								to='/notifications'
								className='flex items-center py-2 px-3 rounded-md hover:bg-gray-100 transition-all duration-200 text-gray-700 hover:text-gray-900 group'
							>
								<Bell className='mr-3 text-gray-500 group-hover:text-blue-600 transition-colors duration-200' size={20} />
								<span>Notifications</span>
							</Link>
						</li>
					</ul>
				</nav>
			</div>
			
			{/* Premium banner */}
			<div className='m-3 p-3 border border-gray-200 rounded-lg bg-gray-50'>
				<h3 className='font-medium text-sm'>Access exclusive tools & insights</h3>
				<Link 
					to="#" 
					className='flex items-center mt-2 text-sm font-medium hover:text-blue-800 transition-colors duration-200 text-gray-700'
				>
					<span className="w-4 h-4 inline-block bg-yellow-500 mr-2 rounded border border-yellow-600"></span>
					Try Premium for free
				</Link>
			</div>
			
			{/* Profile link */}
			<div className='p-3 text-sm text-gray-600 border-t border-gray-200'>
				<Link to={`/profile/${user.username}`} className='text-sm font-medium hover:text-blue-600 transition-colors duration-200'>
					View my profile
				</Link>
			</div>
		</div>
	);
}