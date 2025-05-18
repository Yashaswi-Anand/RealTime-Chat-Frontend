import axios from 'axios';
import { connectSocket } from './socket';
const api = 'http://localhost:9500';
// let api = 'https://real-time-chat-application-snp1.onrender.com';

export const loginUser = async (user_data) => {
    try {
        const response = await axios.post(`${api}/users/v1/login_user`, user_data);
        console.log('Response:', response.data);
        if (response.data.code === 200) {
            const token = response.data.data.jwt_token;
            localStorage.setItem('token', token);
            localStorage.setItem('logged_in_user_id', response.data.data.id);
            connectSocket(response.data.data.id);
        }
        return response;
    } catch (error) {
        throw error;
    }
};


export const registerUser = async (user_data) => {
    try {
        const response = await axios.post(`${api}/users/v1/register_user`, user_data);
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchAllUsers = async (token) => {
    try {
        const response = await axios.get(`${api}/users/v1/get_all_users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.log('Error fetching users:', error);
        throw error;
    }
};

export const sendMessage = async (messageData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${api}/messages/v1/send_message`, messageData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}