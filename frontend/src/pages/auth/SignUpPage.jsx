import React from 'react';
import { Link } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm";

const SignUpPage = () => {
	return (
		<div className='min-h-screen flex flex-col bg-base-100'>
			{/* Top navigation bar */}
			<nav className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
				<div>
					<img className='h-8 w-auto' src='/logo.svg' alt='LinkedIn' />
				</div>
				<div className="flex items-center gap-3">
					<Link to="/auth/login" className="text-sm text-gray-600">Sign In</Link>
					<Link to="/auth/signup" className="btn btn-primary text-white rounded-full px-4 py-1 text-sm">Join Now</Link>
				</div>
			</nav>
			
			{/* Main content */}
			<div className='flex-1 flex flex-col items-center justify-center'>
				{/* Logo */}
				<div className='mb-6'>
					<img className='h-12 w-auto' src='/logo.svg' alt='LinkedIn' />
				</div>
				
				{/* Heading */}
				<h2 className='mb-6 text-2xl font-bold text-neutral'>
					Make the most of your professional life
				</h2>
				
				{/* Form container */}
				<div className='w-full max-w-sm bg-white py-6 px-6 shadow-md rounded-md'>
					<SignUpForm />

					{/* Divider */}
					<div className='mt-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-200'></div>
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-white text-gray-500'>Already on LinkedIn?</span>
							</div>
						</div>
						
						{/* Login link */}
						<div className='mt-4 text-center'>
							<Link to='/auth/login' className='text-primary hover:underline text-sm'>
								Sign in
							</Link>
						</div>
					</div>
				</div>
			</div>
			
			{/* Footer */}
			<div className="py-4 text-center bg-black text-white">
				<p className="text-xs">
					© 2024 LinkedIn Clone. All rights reserved.
				</p>
			</div>
		</div>
	);
};
export default SignUpPage;