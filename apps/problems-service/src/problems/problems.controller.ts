import { PROBLEMS } from '@leetcode/constants';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PrismaService } from '@leetcode/database';
import { GetProblemsQueryDto } from './types';

@Controller('problems')
export class ProblemsController {
    constructor(private prisma: PrismaService) {}

    @MessagePattern(PROBLEMS.FIND_ALL)
    async getAllProblems({ query }: { query: GetProblemsQueryDto }) {
        const limit = Number(query.limit ?? 10);
        const offset = Number(query.offset ?? 0);

        const { name, difficulty, sortBy, sortOrder } = query;

        // Build where clause
        const where: any = {};
        if (name) {
            where.title = { contains: name as string, mode: 'insensitive' };
        }
        if (difficulty) {
            where.difficulty = difficulty as string;
        }

        // Build orderBy
        const orderBy: any = {};
        if (sortBy) {
            orderBy[sortBy as string] = (sortOrder as 'asc' | 'desc') || 'asc';
        } else {
            orderBy['id'] = 'asc'; // default sort
        }

        // Query problems with Prisma
        const [problems, total] = await Promise.all([
            this.prisma.problem.findMany({
                where,
                orderBy,
                skip: offset,
                take: limit,
                include: {
                    problemTags: { select: { tag: true } },
                },
            }),
            this.prisma.problem.count({ where }),
        ]);

        return {
            total,
            limit,
            offset,
            data: problems,
        };
    }
}
