import { Module } from '@nestjs/common';
import { SubmissionsController } from './submissions/submissions.controller';
import { DatabaseModule } from '@leetcode/database';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Configuration, configuration, validate } from '@leetcode/config';
import { BullModule } from '@nestjs/bullmq';
import { ResultsConsumer } from './submissions/submissions.worker';
import { PrometheusController, PrometheusModule } from '@willsoto/nestjs-prometheus';

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
        BullModule.registerQueue({
            name: 'notifications-queue',
        }),
        PrometheusModule.register(),
    ],
    controllers: [SubmissionsController, PrometheusController],
    providers: [ResultsConsumer],
})
export class AppModule {}
