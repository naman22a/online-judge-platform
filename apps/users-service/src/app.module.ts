import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { DatabaseModule } from '@leetcode/database';
import { ConfigModule } from '@nestjs/config';
import { configuration, validate } from '@leetcode/config';

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
    controllers: [UsersController],
    providers: [],
})
export class AppModule {}
