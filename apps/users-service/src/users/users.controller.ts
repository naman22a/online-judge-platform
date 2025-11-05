import { PrismaService } from '@leetcode/database';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { USERS } from '@leetcode/constants';

@Controller('users')
export class UsersController {
    constructor(private prisma: PrismaService) {}

    @MessagePattern(USERS.FIND_ALL)
    async find() {
        return await this.prisma.user.findMany({
            omit: {
                password: true,
                emailVerfied: true,
            },
        });
    }
}
