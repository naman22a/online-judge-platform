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
import { Inject, UseGuards } from '@nestjs/common';
import { CreateSubmissionDto } from '@leetcode/types';
import type { Request } from 'express';
import { signInternalToken } from '../utils';
import { WsThrottlerGuard } from '../guards/ws-throttle.guard';
import { redis } from '../redis';

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

    @UseGuards(WsThrottlerGuard)
    @SubscribeMessage('create-submission')
    async handleCreateSubmission(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: Omit<CreateSubmissionDto, 'userId'>,
    ) {
        const req = socket.request as Request;
        const userId = req.userId;

        const { idempotencyKey } = data;
        if (idempotencyKey) {
            const cached = await redis.get(`idempotency:${idempotencyKey}`);
            if (cached && cached !== '"pending"') {
                socket.emit('execution-done', JSON.parse(cached));
                return;
            }
            await redis.set(`idempotency:${idempotencyKey}`, '"pending"', 'EX', 86400, 'NX');
        }

        const internalToken = signInternalToken('api-gateway', ['submissions:create']);
        return this.client.send(SUBMISSIONS.CREATE, {
            internalToken,
            payload: { ...data, userId },
        });
    }
}
