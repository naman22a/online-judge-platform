import { PrismaService } from '@leetcode/database';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { USERS } from '@leetcode/constants';

@Controller('users')
export class UsersController {
    constructor(private prisma: PrismaService) {}

    @MessagePattern(USERS.FIND_ALL)
    async find({ userId }: { userId: number }) {
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

    @MessagePattern(USERS.CURRENT)
    async me({ userId }: { userId: number }) {
        return await this.prisma.user.findUnique({
            where: { id: userId },
            omit: { password: true, emailVerfied: true, tokenVersion: true },
        });
    }

    @MessagePattern(USERS.FIND_ONE)
    async findOne({ id, userId }: { id: number; userId: number }) {
        if (id === userId) {
            return await this.prisma.user.findUnique({
                where: { id },
                omit: { password: true, emailVerfied: true, tokenVersion: true },
            });
        }
        return await this.prisma.user.findUnique({
            where: { id },
            omit: { email: true, password: true, emailVerfied: true, tokenVersion: true },
        });
    }
}
