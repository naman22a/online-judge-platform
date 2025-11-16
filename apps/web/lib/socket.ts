import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '../global';

let socket: Socket | null = null;

export function getSocket(): Socket | null {
    return socket;
}

export function connectSocket(): Socket | null {
    const token = getAccessToken();
    if (!token) return null;

    // create once
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_API_ENDPOINT!, {
            autoConnect: false,
            transports: ['polling', 'websocket'],
        });
    }

    socket.io.opts.extraHeaders = {
        Authorization: `Bearer ${token}`,
    };

    if (!socket.connected) {
        socket.connect();
    }

    return socket;
}
