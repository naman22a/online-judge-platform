import { PROBLEMS } from '@leetcode/constants';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PrismaService } from '@leetcode/database';

@Controller('problems')
export class ProblemsController {
    constructor(private prisma: PrismaService) {}

    // TODO: add filters, sorting, etc
    @MessagePattern(PROBLEMS.FIND_ALL)
    async getAllProblems() {
        return this.prisma.problem.findMany();
    }
}
