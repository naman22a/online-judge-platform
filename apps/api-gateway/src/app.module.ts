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
                        host: 'localhost',
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
                        host: 'localhost',
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
                        host: 'localhost',
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
                        host: 'localhost',
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
                        host: 'localhost',
                        port: configService.get('companies_service_port'),
                    },
                }),
            },
        ]),
    ],
    controllers: [
        UsersController,
        AuthController,
        ProblemsController,
        TagsController,
        CompaniesController,
    ],
    providers: [],
})
export class AppModule {}
