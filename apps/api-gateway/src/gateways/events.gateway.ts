import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketAuthMiddleware } from '../middleware/ws.middleware';
import { MICROSERVICES, SUBMISSIONS } from '@leetcode/constants';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { CreateSubmissionDto } from '@leetcode/types';

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

    afterInit(client: Socket) {
        client.use(SocketAuthMiddleware() as any);
    }

    handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
    }

    @SubscribeMessage('create-submission')
    handleCreateSubmission(@MessageBody() data: CreateSubmissionDto) {
        this.client.send(SUBMISSIONS.CREATE, data);
    }
}
