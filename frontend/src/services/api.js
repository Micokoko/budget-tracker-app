import axios from 'axios';

export const API_URL = 'http://127.0.0.1:3000';

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

export const fetchEntriesByUsername = async (username, month) => {
        const response = await fetch(`${API_URL}/entries?username=${username}&month=${month}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
};


export const getEntryById = async (id, username) => {
    const response = await fetch(`${API_URL}/entries/${id}?username=${username}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch entry');
    }
    
    return await response.json();
};




export const deleteEntryById = async (id, username) => {
    const response = await apiClient.delete(`/entries/${id}?username=${username}`);
    return response.data; 
};
