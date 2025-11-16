import { Module } from '@nestjs/common';
import { ExecutionService } from './execution/execution.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Configuration, configuration, validate } from '@leetcode/config';
import { DatabaseModule } from '@leetcode/database';
import { RedisService } from './execution/redis.service';
import { ExecutionConsumer } from './execution/execution.worker';
import { BullModule } from '@nestjs/bullmq';

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
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService<Configuration>) => ({
                connection: {
                    host: configService.get('redis_host'),
                    port: configService.get('redis_port'),
                },
            }),
        }),
        BullModule.registerQueue({
            name: 'execution-queue',
        }),
    ],
    controllers: [],
    providers: [ExecutionService, RedisService, ExecutionConsumer],
})
export class AppModule {}
