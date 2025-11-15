import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@leetcode/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private sub: Redis;
    private pub: Redis;

    constructor(private configService: ConfigService<Configuration>) {}

    onModuleInit() {
        this.sub = new Redis({
            host: this.configService.get('redis_host'),
            port: this.configService.get('redis_port'),
        });
        this.pub = new Redis({
            host: this.configService.get('redis_host'),
            port: this.configService.get('redis_port'),
        });

        this.sub.psubscribe('execute:done:*', (err, count) => {
            if (err) throw err;
            console.log(`Subscribed to ${count} channels`);
        });

        this.sub.on('pmessage', (_pattern, channel, message) => {
            const [, , socketId] = channel.split(':');
            const data = JSON.parse(message);
            Logger.log(`📤 Emitting to ${socketId}:` + JSON.stringify(data));
            // TODO: fix this
            // this.eventsGateway.server.to(socketId).emit('execute:done', data);
        });
    }

    onModuleDestroy() {
        this.sub.quit();
        this.pub.quit();
    }

    async publish(channel: string, message: any) {
        await this.pub.publish(channel, JSON.stringify(message));
    }
}
