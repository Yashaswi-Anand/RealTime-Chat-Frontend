import axios from 'axios';

const url = 'http://localhost:9500';

const api = axios.create({
    baseURL: url,
});

api.defaults.withCredentials = true;

api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        config.headers['Content-Type'] = 'application/json'
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;