import { Module } from '@nestjs/common';
import { MICROSERVICES } from '@leetcode/constants';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './controllers/users/users.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { ProblemsController } from './controllers/problems/problems.controller';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: MICROSERVICES.USERS_SERVICE,
                transport: Transport.TCP,
                options: {
                    port: 5001,
                },
            },
            {
                name: MICROSERVICES.AUTH_SERVICE,
                transport: Transport.TCP,
                options: {
                    port: 5002,
                },
            },
            {
                name: MICROSERVICES.PROBLEMS_SERVICE,
                transport: Transport.TCP,
                options: {
                    port: 5003,
                },
            },
        ]),
    ],
    controllers: [UsersController, AuthController, ProblemsController],
    providers: [],
})
export class AppModule {}
