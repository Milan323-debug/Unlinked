import axios from "axios";

// Get the current hostname to determine environment
const hostname = window.location.hostname;
const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';

// In production, use relative path which will be served from the same domain
// In development, use the full localhost URL
const baseURL = isDevelopment
  ? "http://localhost:3000/api/v1"
  : "/api/v1";

console.log("Current environment:", isDevelopment ? "development" : "production");
console.log("Using baseURL:", baseURL);

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