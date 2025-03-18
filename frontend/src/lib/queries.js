import axios from 'axios';
import { axiosInstance } from './axios.js';

export const fetchAuthUser = async () => {
    try {
        const { data } = await axiosInstance.get('/auth/me');
        return data;
    } catch (error) {
        throw error;
    }
}; 