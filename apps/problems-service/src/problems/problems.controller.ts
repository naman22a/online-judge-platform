import { PROBLEMS } from '@leetcode/constants';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PrismaService } from '@leetcode/database';
import { GetProblemsQueryDto } from './types';
import { ProblemsService } from './problems.service';
import type { CreateProblemDto, InternalMessage, UpdateProblemDto } from '@leetcode/types';
import { InternalAuth } from '@leetcode/common';

@Controller('problems')
export class ProblemsController {
    constructor(
        private prisma: PrismaService,
        private problemsService: ProblemsService,
    ) {}

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
                    testCases: {
                        where: { isActive: true, isSample: true },
                        select: {
                            id: true,
                            input: true,
                            expectedOutput: true,
                            explanation: true,
                            isSample: true,
                            isActive: true,
                        },
                    },
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

    @MessagePattern(PROBLEMS.FIND_ONE)
    async findOneProblem({ slug }: { slug: string }) {
        const problem = await this.prisma.problem.findUnique({
            where: { slug },
            include: {
                testCases: {
                    where: { isActive: true, isSample: true },
                    select: {
                        id: true,
                        input: true,
                        expectedOutput: true,
                        explanation: true,
                        isSample: true,
                        isActive: true,
                    },
                },
                problemTags: { select: { tag: true } },
                // TODO: add them when you implement on frontend
                // comments: true,
                // editorials: true,
                // submissions: true,
                problemCompanies: { select: { company: true } },
            },
        });
        if (!problem)
            return { ok: false, errors: [{ field: 'slug', message: 'problem not found' }] };

        return problem;
    }

    @InternalAuth('problems:create')
    @MessagePattern(PROBLEMS.CREATE)
    async createProblem(message: InternalMessage<{ userId: number; dto: CreateProblemDto }>) {
        return await this.problemsService.create(message.payload);
    }

    @MessagePattern(PROBLEMS.DELETE)
    async deleteProblem({ id }: { id: number }) {
        try {
            await this.prisma.problem.delete({ where: { id } });

            return { ok: true };
        } catch (error) {
            if (error.code === 'P2025')
                return { ok: false, errors: [{ field: 'id', message: 'problem not found' }] };
            Logger.error(error);
            return { ok: false };
        }
    }

    @MessagePattern(PROBLEMS.UPDATE)
    async updateProblem({ id, dto }: { id: number; dto: UpdateProblemDto }) {
        return this.problemsService.update(id, dto);
    }
}
