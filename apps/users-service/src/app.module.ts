import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { DatabaseModule } from '@leetcode/database';
import { ConfigModule } from '@nestjs/config';
import { configuration, validate } from '@leetcode/config';
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
        PrometheusModule.register(),
    ],
    controllers: [UsersController, PrometheusController],
    providers: [],
})
export class AppModule {}
