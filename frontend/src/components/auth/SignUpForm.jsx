import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';  
import { axiosInstance } from '../../lib/axios.js';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const SignUpForm = ({ signUp }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();

  const { mutate: signUpMutation, isLoading } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post('/auth/signup', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Account created successfully');
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error("error.response.data.message || 'Something went wrong'");
    },
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    signUpMutation({ name, email, username, password });
  };

  return (
    <form onSubmit={handleSignUp} className='space-y-4 w-full'>
      <div>
        <input
          id="fullName"
          type='text'
          placeholder='Full name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='input input-bordered w-full h-12 rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
          required
        />
      </div>
      
      <div>
        <input
          id="username"
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='input input-bordered w-full h-12 rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
          required
        />
      </div>
      
      <div>
        <input
          id="email"
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='input input-bordered w-full h-12 rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
          required
        />
      </div>
      
      <div>
        <input
          id="signupPassword"
          type='password'
          placeholder='Password (6+ characters)'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='input input-bordered w-full h-12 rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
          required
          minLength={6}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading} 
        className='w-full h-12 rounded-md text-white flex items-center justify-center bg-primary hover:bg-primary-focus font-medium'
      >
        {isLoading ? <Loader className='size-5 animate-spin mr-2' /> : 'Agree & Join'}
      </button>
    </form>
  );
};

export default SignUpForm;