import { InternalMessage } from '@leetcode/types';
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    UnauthorizedException,
    ForbiddenException,
    UseInterceptors,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class InternalAuthInterceptor implements NestInterceptor {
    constructor(private readonly requiredScopes: string[] = []) {}

    intercept(context: ExecutionContext, next: CallHandler) {
        const rpcCtx = context.switchToRpc();
        const data = rpcCtx.getData<InternalMessage<any>>();

        if (!data?.internalToken) {
            throw new UnauthorizedException('Missing internal token');
        }

        let payload: any;

        try {
            payload = jwt.verify(data.internalToken, process.env.INTERNAL_JWT_SECRET!, {
                issuer: process.env.INTERNAL_JWT_ISSUER,
            });
        } catch {
            throw new UnauthorizedException('Invalid internal token');
        }

        if (payload.type !== 'service') {
            throw new UnauthorizedException('Invalid token type');
        }

        if (
            this.requiredScopes.length &&
            !this.requiredScopes.every((scope) => payload.scope?.includes(scope))
        ) {
            throw new ForbiddenException('Insufficient service scope');
        }

        rpcCtx.getContext().service = payload.sub;

        return next.handle();
    }
}

export const InternalAuth = (...scopes: string[]) =>
    UseInterceptors(new InternalAuthInterceptor(scopes));
