import React from 'react';
import { Link } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm";

const SignUpPage = () => {
	return (
		<div className='min-h-screen flex flex-col bg-base-100'>
			{/* Top navigation bar */}
			<nav className="flex justify-between items-center py-3 px-6 border-b border-gray-200 bg-white">
				<div>
					<Link to="/">
						<img className='h-8 w-auto' src='/logo.svg' alt='LinkedIn' />
					</Link>
				</div>
				<div className="flex items-center gap-4">
					<Link to="/auth/login" className="text-sm text-gray-600 hover:text-primary">Sign In</Link>
					<Link to="/auth/signup" className="btn btn-primary text-white rounded-full px-4 py-1.5 text-sm">Join Now</Link>
				</div>
			</nav>
			
			{/* Main content */}
			<div className='flex-1 flex flex-col items-center justify-center py-10'>
				{/* Logo and heading */}
				<div className="mb-8 text-center">
					<img className='h-16 w-auto mx-auto mb-6' src='/logo.svg' alt='LinkedIn' />
					<h2 className='text-3xl font-bold text-neutral'>
						Make the most of your professional life
					</h2>
				</div>
				
				{/* Form container */}
				<div className='w-full max-w-sm bg-white py-6 px-6 shadow-md rounded-md'>
					<SignUpForm />

					{/* Divider */}
					<div className='mt-6 border-t border-gray-200 pt-6'>
						<div className='text-center'>
							<span className='text-gray-500'>Already on LinkedIn?</span>
							{' '}
							<Link to='/auth/login' className='text-primary hover:underline text-sm font-medium'>
								Sign in
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;