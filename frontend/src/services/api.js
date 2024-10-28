import axios from 'axios';

const API_URL = 'http://localhost:3000'; //change this according to URL used at the time of rails s

export const loginUser = async (credentials) => {
    return await axios.post(`${API_URL}/users/sign_in`, credentials)
}

export const signupUser = async (userData) => {
    return await axios.post(`${API_URL}/users`, userData)
}

