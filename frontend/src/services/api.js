import axios from 'axios';

const API_URL = 'http://127.0.0.1:3000' 

export const loginUser = async (credentials) => {
    return await axios.post(`${API_URL}/users/sign_in`, credentials)
}

export const signupUser = async (userData) => {
    return await axios.post(`${API_URL}/users`, userData)
}

