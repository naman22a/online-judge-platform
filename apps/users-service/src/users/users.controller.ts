import { PrismaService } from '@leetcode/database';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
    constructor(private prisma: PrismaService) {}

    @MessagePattern('users.findAll')
    async find() {
        return await this.prisma.user.findMany({
            omit: {
                password: true,
                emailVerfied: true,
            },
        });
    }
}
