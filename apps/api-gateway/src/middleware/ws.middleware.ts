import { Socket } from 'socket.io';
import { WsAuthGuard } from '../guards/ws-auth.guard';

export type SocketIOMiddleware = {
    (client: Socket, next: (err?: Error) => void);
};

export const SocketAuthMiddleware = (): SocketIOMiddleware => {
    return (client, next) => {
        try {
            WsAuthGuard.validateRequest(client);
            next();
        } catch (error) {
            next(error);
        }
    };
};
