import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './controllers/users/users.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { MICROSERVICES } from '@leetcode/constants';

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
        ]),
    ],
    controllers: [UsersController, AuthController],
    providers: [],
})
export class AppModule {}
