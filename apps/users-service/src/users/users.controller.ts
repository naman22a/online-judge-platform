import { PrismaService, User } from '@leetcode/database';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { USERS } from '@leetcode/constants';
import type { InternalMessage, OkResponse } from '@leetcode/types';
import { InternalAuth } from '@leetcode/common';

@Controller('users')
export class UsersController {
    constructor(private prisma: PrismaService) {}

    @InternalAuth('users:findAll')
    @MessagePattern(USERS.FIND_ALL)
    async find(message: InternalMessage<{ userId: number }>) {
        const { userId } = message.payload;
        const currentUser = await this.prisma.user.findUnique({
            where: { id: userId },
            omit: { password: true, emailVerfied: true, tokenVersion: true },
        });

        const otherUsers = await this.prisma.user.findMany({
            where: { id: { not: userId } },
            omit: { password: true, emailVerfied: true, tokenVersion: true, email: true },
        });

        return [currentUser, ...otherUsers];
    }

    @InternalAuth('users:me')
    @MessagePattern(USERS.CURRENT)
    async me(message: InternalMessage<{ userId: number }>) {
        const { userId } = message.payload;
        return await this.prisma.user.findUnique({
            where: { id: userId },
            omit: { password: true, emailVerfied: true, tokenVersion: true },
        });
    }

    @InternalAuth('users:findOne')
    @MessagePattern(USERS.FIND_ONE)
    async findOne(message: InternalMessage<{ id: number; userId: number }>) {
        const { id, userId } = message.payload;

        if (id === userId) {
            return await this.prisma.user.findUnique({
                where: { id },
                omit: { password: true, emailVerfied: true, tokenVersion: true },
            });
        }
        const user = await this.prisma.user.findUnique({
            where: { id },
            omit: { email: true, password: true, emailVerfied: true, tokenVersion: true },
        });

        if (!user) {
            return {
                ok: false,
                errors: [
                    {
                        field: 'id',
                        message: 'user not found',
                    },
                ],
            };
        }

        return user;
    }

    @InternalAuth('users:update')
    @MessagePattern(USERS.UPDATE)
    async updateOne(
        message: InternalMessage<{
            userId: number;
            body: Omit<
                Partial<User>,
                | 'password'
                | 'email'
                | 'emailVerfied'
                | 'tokenVersion'
                | 'is_admin'
                | 'id'
                | 'created_at'
                | 'updated_at'
            >;
        }>,
    ): Promise<OkResponse> {
        const { body, userId } = message.payload;
        if (!body)
            return { ok: false, errors: [{ field: 'all', message: 'atleast provide one field' }] };

        if (body.username) {
            const usernameTaken = await this.prisma.user.findUnique({
                where: { username: body.username },
            });
            if (usernameTaken) {
                return {
                    ok: false,
                    errors: [
                        {
                            field: 'username',
                            message: 'username already taken',
                        },
                    ],
                };
            }
        }

        await this.prisma.user.update({ where: { id: userId }, data: body });

        return { ok: true };
    }
}
