import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

export const fetchAuthUser = async () => {
    try {
        const { data } = await axios.get(`${BASE_URL}/auth/me`, {
            withCredentials: true
        });
        return data;
    } catch (error) {
        throw error;
    }
}; 