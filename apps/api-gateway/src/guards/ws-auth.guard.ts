import 'dotenv/config';
import { AccessTokenPayload } from '@leetcode/types';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        if (context.getType() !== 'ws') {
            return true;
        }

        const client: Socket = context.switchToWs().getClient();
        WsAuthGuard.validateRequest(client);

        return true;
    }

    static validateRequest(socket: Socket) {
        const req = socket.request as Request;

        const authorization = req.headers['authorization'];

        if (!authorization) {
            throw new WsException('Unauthorized');
        }

        try {
            const token = authorization.split(' ')[1];
            const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!) as AccessTokenPayload;
            req.userId = payload.userId;

            return true;
        } catch (error) {
            throw new WsException('Unauthorized');
        }
    }
}
