import { MICROSERVICES, USERS } from '@leetcode/constants';
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
    constructor(@Inject(MICROSERVICES.USERS_SERVICE) private client: ClientProxy) {}

    @Get()
    getUsers() {
        return this.client.send(USERS.FIND_ALL, {});
    }
}
