import { MICROSERVICES, USERS } from '@leetcode/constants';
import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Patch,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../../guards/auth.guard';
import type { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDetails } from './types';
import { signInternalToken } from '../../utils';
import { firstValueFrom } from 'rxjs';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    constructor(@Inject(MICROSERVICES.USERS_SERVICE) private client: ClientProxy) {}

    @Get()
    getUsers(@Req() req: Request) {
        const userId = req.userId;
        const internalToken = signInternalToken('api-gateway', ['users:findAll']);

        return this.client.send(USERS.FIND_ALL, { internalToken, payload: { userId } });
    }

    @Get('me')
    getMe(@Req() req: Request) {
        const userId = req.userId;
        const internalToken = signInternalToken('api-gateway', ['users:me']);

        return this.client.send(USERS.CURRENT, { internalToken, payload: { userId } });
    }

    @Get(':id')
    async getOneUser(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        const userId = req.userId;
        const internalToken = signInternalToken('api-gateway', [`users:findOne`]);

        return await firstValueFrom(
            this.client.send(USERS.FIND_ONE, { internalToken, payload: { id, userId } }),
        );
    }

    @Patch()
    async updateUser(@Req() req: Request, @Body() body: UpdateUserDetails) {
        const userId = req.userId;
        const internalToken = signInternalToken('api-gateway', [`users:update`]);

        return this.client.send(USERS.UPDATE, { internalToken, payload: { userId, body } });
    }
}
