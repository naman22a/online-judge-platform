import 'dotenv/config';
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { AccessTokenPayload } from '@leetcode/types';
import { MICROSERVICES, USERS } from '@leetcode/constants';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { User } from '@leetcode/database';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(@Inject(MICROSERVICES.USERS_SERVICE) private client: ClientProxy) {}

    private logger = new Logger();

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest() as Request;
        const authorization = req.headers['authorization'];

        if (!authorization) {
            throw new UnauthorizedException();
        }

        let payload: AccessTokenPayload;

        try {
            const token = authorization.split(' ')[1];
            payload = verify(token, process.env.ACCESS_TOKEN_SECRET!) as AccessTokenPayload;
            req.userId = payload.userId;
        } catch (error) {
            this.logger.error(error);
            throw new UnauthorizedException();
        }

        const user = (await firstValueFrom(
            this.client.send(USERS.CURRENT, { userId: payload.userId }),
        )) as Omit<User, 'password' | 'emailVerfied' | 'tokenVersion'>;

        if (!user.is_admin) {
            throw new ForbiddenException();
        }

        return true;
    }
}
