import { SUBMISSIONS } from '@leetcode/constants';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PrismaService } from '@leetcode/database';
import { CreateSubmissionDto } from '@leetcode/types';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Controller()
export class SubmissionsController {
    constructor(
        private prisma: PrismaService,
        @InjectQueue('execution-queue') private executionQueue: Queue,
    ) {}

    @MessagePattern(SUBMISSIONS.FIND_ALL)
    async findAll({ userId, problemId }: { userId: number; problemId: number }) {
        return await this.prisma.submission.findMany({
            where: { problemId: problemId, userId: userId },
        });
    }

    @MessagePattern(SUBMISSIONS.CREATE)
    async create({ code, language, socketId, problemId, userId }: CreateSubmissionDto) {
        // validation
        if (!code) return { jobId: null, errors: [{ field: 'code', message: 'code is required' }] };
        if (!language)
            return {
                jobId: null,
                errors: [{ field: 'language', message: 'language is required' }],
            };
        if (!socketId)
            return {
                jobId: null,
                errors: [{ field: 'socketId', message: 'socketId is required' }],
            };
        if (!problemId)
            return {
                jobId: null,
                errors: [{ field: 'problemId', message: 'problemId is required' }],
            };

        // check if problem exists
        const problemExists = await this.prisma.problem.findUnique({ where: { id: problemId } });
        if (!problemExists)
            return { jobId: null, errors: [{ field: 'problemId', message: 'problem not found' }] };

        // push job into execution queue
        const job = await this.executionQueue.add('execute-job', {
            code,
            language,
            problemId,
            socketId,
            userId,
        });

        return { jobId: job.id };
    }
}
