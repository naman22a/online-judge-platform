import { Module } from '@nestjs/common';
import { ExecutionService } from './execution/execution.service';
import { ConfigModule } from '@nestjs/config';
import { configuration, validate } from '@leetcode/config';
import { DatabaseModule } from '@leetcode/database';
import { RedisService } from './execution/redis.service';
import { ExecutionConsumer } from './execution/execution.worker';
import { EventsGateway } from './execution/events.gateway';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            expandVariables: true,
            load: [configuration],
            validate,
        }),
        DatabaseModule,
    ],
    controllers: [],
    providers: [ExecutionService, RedisService, ExecutionConsumer, EventsGateway],
})
export class AppModule {}
