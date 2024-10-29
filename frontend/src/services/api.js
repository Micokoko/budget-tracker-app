import axios from 'axios';

const API_URL = 'http://127.0.0.1:3000';


const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        const errorMessage = error.response?.data?.errors || 'An error occurred';
        return Promise.reject(errorMessage);
    }
);

export const loginUser = async (credentials) => {
    const response = await apiClient.post('/users/sign_in', credentials);
    return response.data;
};

export const signupUser = async (userData) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
};
