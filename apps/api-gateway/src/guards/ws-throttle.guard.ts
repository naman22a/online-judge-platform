import { Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsThrottlerGuard extends ThrottlerGuard {
    async handleRequest(requestProps: ThrottlerRequest): Promise<boolean> {
        const { context, limit, ttl, throttler, blockDuration, getTracker, generateKey } =
            requestProps;

        const client = context.switchToWs().getClient();
        const tracker = client?._socket?.remoteAddress;
        const key = generateKey(context, tracker, throttler.name!);
        const { totalHits, timeToExpire, isBlocked, timeToBlockExpire } =
            await this.storageService.increment(key, ttl, limit, blockDuration, throttler.name!);

        if (isBlocked) {
            throw new WsException({
                limit,
                ttl,
                key,
                tracker,
                totalHits,
                timeToExpire,
                isBlocked,
                timeToBlockExpire,
            });
        }

        return true;
    }
}
