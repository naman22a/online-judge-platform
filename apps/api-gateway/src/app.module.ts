import { Module } from '@nestjs/common';
import { MICROSERVICES } from '@leetcode/constants';
import { ClientsModule, TcpClientOptions, Transport } from '@nestjs/microservices';
import { UsersController } from './controllers/users/users.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { ProblemsController } from './controllers/problems/problems.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Configuration, configuration, validate } from '@leetcode/config';
import { TagsController } from './controllers/tags/tags.controller';
import { CompaniesController } from './controllers/companies/companies.controller';
import { SubmissionsController } from './controllers/submissions/submissions.controller';
import { EventsGateway } from './gateways/events.gateway';
import { BullModule } from '@nestjs/bullmq';
import { NotificationConsumer } from './workers/notification.worker';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        ConfigModule.forRoot({
            cache: true,
            isGlobal: true,
            expandVariables: true,
            load: [configuration],
            validate,
        }),
        ClientsModule.registerAsync([
            {
                name: MICROSERVICES.USERS_SERVICE,
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService<Configuration>): TcpClientOptions => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get('users_service_host'),
                        port: configService.get('users_service_port'),
                    },
                }),
            },
            {
                name: MICROSERVICES.AUTH_SERVICE,
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService<Configuration>): TcpClientOptions => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get('auth_service_host'),
                        port: configService.get('auth_service_port'),
                    },
                }),
            },
            {
                name: MICROSERVICES.PROBLEMS_SERVICE,
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService<Configuration>): TcpClientOptions => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get('problems_service_host'),
                        port: configService.get('problems_service_port'),
                    },
                }),
            },
            {
                name: MICROSERVICES.TAGS_SERVICE,
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService<Configuration>): TcpClientOptions => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get('tags_service_host'),
                        port: configService.get('tags_service_port'),
                    },
                }),
            },
            {
                name: MICROSERVICES.COMPANIES_SERVICE,
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService<Configuration>): TcpClientOptions => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get('companies_service_host'),
                        port: configService.get('companies_service_port'),
                    },
                }),
            },
            {
                name: MICROSERVICES.SUBMISSIONS_SERVICE,
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService<Configuration>): TcpClientOptions => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get('submissions_service_host'),
                        port: configService.get('submissions_service_port'),
                    },
                }),
            },
        ]),
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
            name: 'notifications-queue',
        }),
        PrometheusModule.register(),
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 100,
            },
        ]),
    ],
    controllers: [
        UsersController,
        AuthController,
        ProblemsController,
        TagsController,
        CompaniesController,
        SubmissionsController,
    ],
    providers: [
        EventsGateway,
        NotificationConsumer,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
