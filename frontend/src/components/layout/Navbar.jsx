import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios';
import { Link, useNavigate } from "react-router-dom";
import { Bell, Home, LogOut, User, Users } from "lucide-react";
import toast from 'react-hot-toast';

const Navbar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: authUser, error: authError } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        return res.data;
      } catch (error) {
        if (error?.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    onError: (error) => {
      if (error?.response?.status === 401) {
        return;
      }
      console.error("Error fetching authUser:", error);
      toast.error("Error checking authentication status");
    }
  });

  const { data: notifications, error: notificationsError } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/notifications');
        return res.data;
      } catch (error) {
        if (error?.response?.status === 401) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!authUser,
    retry: false,
    refetchOnWindowFocus: false,
    onError: (error) => {
      if (error?.response?.status === 401) return;
      console.error("Error fetching notifications:", error);
    }
  });

  const { data: connectionRequests, error: connectionRequestsError } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/connections/requests');
        return res.data;
      } catch (error) {
        if (error?.response?.status === 401) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!authUser,
    retry: false,
    refetchOnWindowFocus: false,
    onError: (error) => {
      if (error?.response?.status === 401) return;
      console.error("Error fetching connectionRequests:", error);
    }
  });

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        await axiosInstance.post('/auth/logout');
      } catch (error) {
        if (error?.response?.status === 401) {
          return; // Already logged out
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.clear(); // Clear all queries
      toast.success('Logged out successfully');
      navigate('/auth/login');
    },
    onError: (error) => {
      console.error("Error logging out:", error);
      toast.error('Error logging out. Please try again.');
    }
  });

  // Only show error if it's not a 401
  if ((authError && authError?.response?.status !== 401) || 
      (notificationsError && notificationsError?.response?.status !== 401) || 
      (connectionRequestsError && connectionRequestsError?.response?.status !== 401)) {
    console.error("Error fetching data:", authError || notificationsError || connectionRequestsError);
    return <div>Error loading data</div>;
  }

  const userNotifications = notifications?.filter((notification) => !notification.read).length || 0;
  const userConnectionRequests = connectionRequests?.length || 0;

  return (
    <nav className='bg-secondary shadow-md sticky top-0 z-10'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between items-center py-3'>
          <div className='flex items-center space-x-4'>
            <Link to='/'>
              <img className='h-8 rounded' src='/small-logo.png' alt='LinkedIn' />
            </Link>
          </div>
          <div className='flex items-center gap-2 md:gap-6'>
            {authUser ? (
              <>
                <Link to="/" className='text-neutral flex flex-col items-center'>
                  <Home size={20} />
                  <span className='text-xs hidden md:block'>Home</span>
                </Link>
                <Link to='/network' className='text-neutral flex flex-col items-center relative'>
                  <Users size={20} />
                  <span className='text-xs hidden md:block'>My Network</span>
                  {userConnectionRequests > 0 && (
                    <span
                      className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
                    rounded-full size-3 md:size-4 flex items-center justify-center'
                    >
                      {userConnectionRequests}
                    </span>
                  )}
                </Link>
                <Link to='/notifications' className='text-neutral flex flex-col items-center relative'>
                  <Bell size={20} />
                  <span className='text-xs hidden md:block'>Notifications</span>
                  {userNotifications > 0 && (
                    <span
                      className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
                    rounded-full size-3 md:size-4 flex items-center justify-center'
                    >
                      {userNotifications}
                    </span>
                  )}
                </Link>
                <Link
                  to={`/profile/${authUser.username}`}
                  className='text-neutral flex flex-col items-center'
                >
                  <User size={20} />
                  <span className='text-xs hidden md:block'>Me</span>
                </Link>
                <button
                  className='flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800'
                  onClick={() => logout()}
                >
                  <LogOut size={20} />
                  <span className='hidden md:inline'>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to='/auth/login' className='btn btn-ghost'>
                  Sign In
                </Link>
                <Link to='/auth/signup' className='btn btn-primary'>
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;