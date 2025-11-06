import { MICROSERVICES, USERS } from '@leetcode/constants';
import { Controller, Get, Inject, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../guards/auth.guard';
import type { Request } from 'express';
import { firstValueFrom } from 'rxjs';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    constructor(@Inject(MICROSERVICES.USERS_SERVICE) private client: ClientProxy) {}

    @Get()
    getUsers(@Req() req: Request) {
        const userId = req.userId;
        return this.client.send(USERS.FIND_ALL, { userId });
    }

    @Get('me')
    getMe(@Req() req: Request) {
        const userId = req.userId;
        return this.client.send(USERS.CURRENT, { userId });
    }

    @Get(':id')
    async getOneUser(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        const userId = req.userId;
        return await firstValueFrom(this.client.send(USERS.FIND_ONE, { id, userId }));
    }
}
