import axios from 'axios';

export const loginUser = async (user_data) => {
    try {
        const response = await axios.post('http://localhost:9500/users/v1/login_user', user_data);
        if (response.status === 200) {
            const { token } = response.data;
            localStorage.setItem('token', token);
        }
        return response;
    } catch (error) {
        throw error;
    }
}

export const registerUser = async (user_data) => {
    try {
        const response = await  axios.post('http://localhost:9500/users/v1/register_user', user_data);
        return response;
    } catch (error) {
        throw error;
    }
}