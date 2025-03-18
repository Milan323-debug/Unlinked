import React from 'react';
import { Link } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm";

const SignUpPage = () => {
    return (
        <div className='min-h-screen flex flex-col bg-base-100'>
            {/* Main content */}
            <div className='flex-1 flex flex-col items-center justify-center py-10'>
                {/* Logo and heading */}
                <div className="mb-8 text-center">
                    <img className='h-34 w-auto mx-auto mb-6' src='/logo.svg' alt='LinkedIn' />
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