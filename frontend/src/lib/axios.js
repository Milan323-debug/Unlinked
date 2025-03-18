import axios from "axios";

const baseURL = import.meta.env.PROD 
  ? "/api/v1"  // In production, use relative path
  : "http://localhost:3000/api/v1"; // In development, use full URL

export const axiosInstance = axios.create({ 
    baseURL,
    withCredentials: true,
});