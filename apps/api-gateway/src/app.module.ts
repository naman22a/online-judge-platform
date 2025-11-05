import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'USERS_SERVICE',
                transport: Transport.TCP,
                options: {
                    port: 5001,
                },
            },
            {
                name: 'AUTH_SERVICE',
                transport: Transport.TCP,
                options: {
                    port: 5002,
                },
            },
        ]),
    ],
    controllers: [AppController, UsersController, AuthController],
    providers: [AppService],
})
export class AppModule {}
