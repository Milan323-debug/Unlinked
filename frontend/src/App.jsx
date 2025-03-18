import React, { useEffect } from 'react';
import Layout from "./components/layout/Layout.jsx";
import { Route, Routes, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './lib/axios.js';

// Page imports
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SignUpPage from './pages/auth/SignUpPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import NetworkPage from './pages/NetworkPage.jsx';
import PostPage from './pages/PostPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function App() {
  useEffect(() => {
    // Display a message to confirm the app is loading
    console.log("App component mounted");
    
    // Test API connection using axiosInstance instead of hardcoded fetch
    axiosInstance.get('/auth/me')
      .then(res => {
        console.log("API connection status:", res.status);
      })
      .catch(err => {
        console.error("Error connecting to API:", err);
        // Only show error toast for non-auth failures
        if (!err.response || err.response.status !== 401) {
          toast.error("Cannot connect to server. Please make sure backend is running.");
        } else {
          console.log("Authentication required - this is expected if not logged in");
        }
      });
  }, []);

  const { data: authUser, isLoading, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        return res.data;
      } catch (error) {
        console.error("Auth error details:", error);
        if (error?.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error("Auth query error:", error);
      if (!error.response || error.response.status !== 401) {
        toast.error(error?.response?.data?.message || "Error connecting to server");
      }
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // If there's an error but not 401, show basic login page instead of crashing
  if (error && error?.response?.status !== 401) {
    return (
      <Layout>
        <Routes>
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/auth/login" />} />
        </Routes>
        <Toaster />
      </Layout>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/auth/login" />} />
        <Route path="/auth/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/auth/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to="/auth/login" />} />
        <Route path="/network" element={authUser ? <NetworkPage /> : <Navigate to="/auth/login" />} />
        <Route path="/post/:postId" element={authUser ? <PostPage /> : <Navigate to="/auth/login" />} />
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/auth/login" />} />
      </Routes>
      <Toaster />
    </Layout>
  );
}

export default App;