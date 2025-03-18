import axios from "axios";

// In production, use relative path which will be served from the same domain
// In development, use the full localhost URL
const baseURL = import.meta.env.PROD 
  ? "/api/v1"  
  : "http://localhost:3000/api/v1"; 

export const axiosInstance = axios.create({ 
    baseURL,
    withCredentials: true,
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  config => {
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);