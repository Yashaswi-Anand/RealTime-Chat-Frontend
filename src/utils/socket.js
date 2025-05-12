import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (user_id) => {
    socket = io('http://localhost:9500', {
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