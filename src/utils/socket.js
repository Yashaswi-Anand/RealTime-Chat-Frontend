import { io } from 'socket.io-client';
let api = 'https://real-time-chat-application-snp1.onrender.com';
// let api = 'http://localhost:9500';
let socket = null;

export const connectSocket = (user_id) => {
    socket = io(api, {
        query: { user_id },
        transports: ['websocket'],
    });

    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    return socket;
};

export const getSocket = () => socket;