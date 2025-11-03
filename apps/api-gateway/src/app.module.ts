import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users/users.controller';

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
        ]),
    ],
    controllers: [AppController, UsersController],
    providers: [AppService],
})
export class AppModule {}
