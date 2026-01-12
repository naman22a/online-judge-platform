import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketAuthMiddleware } from '../middleware/ws.middleware';
import { MICROSERVICES, SUBMISSIONS } from '@leetcode/constants';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { CreateSubmissionDto } from '@leetcode/types';
import type { Request } from 'express';
import { signInternalToken } from '../utils';

@WebSocketGateway({
    cors: {
        origin: '*',
        credentials: true,
    },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(@Inject(MICROSERVICES.SUBMISSIONS_SERVICE) private client: ClientProxy) {}

    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        server.of('/').use(SocketAuthMiddleware());
    }

    handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
    }

    @SubscribeMessage('create-submission')
    handleCreateSubmission(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: Omit<CreateSubmissionDto, 'userId'>,
    ) {
        const req = socket.request as Request;
        const userId = req.userId;
        const internalToken = signInternalToken('api-gateway', ['submissions:create']);
        return this.client.send(SUBMISSIONS.CREATE, {
            internalToken,
            payload: { ...data, userId },
        });
    }
}
