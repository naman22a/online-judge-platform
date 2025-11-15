import { SUBMISSIONS } from '@leetcode/constants';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PrismaService } from '@leetcode/database';
import { CreateSubmissionDto } from '@leetcode/types';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { getHash } from '../utils';
import { redis } from '../redis';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Controller('submissions')
export class SubmissionsController {
    constructor(
        private prisma: PrismaService,
        @InjectQueue('submissions') private submissionsQueue: Queue,
    ) {}

    @WebSocketServer()
    io: Server<any, any>;

    @MessagePattern(SUBMISSIONS.FIND_ALL)
    async findAll({ userId, problemId }: { userId: number; problemId: number }) {
        return await this.prisma.submission.findMany({
            where: { problemId: problemId, userId: userId },
        });
    }

    @MessagePattern(SUBMISSIONS.CREATE)
    async create({
        userId,
        problemId,
        body,
    }: {
        userId: number;
        problemId: number;
        body: CreateSubmissionDto;
    }) {
        if (!body || !body.code || !body.language || !body.socketId)
            return { message: 'validation error' };

        const { code, language, socketId } = body;

        const hash = getHash(`${code}:${language}`);
        const cached = await redis.get(`execute:${hash}`);

        if (cached) {
            this.io.to(socketId).emit('execute:done', {
                cached: true,
                report: JSON.parse(cached),
            });
            return { cached: true, jobId: null };
        }

        const job = await this.submissionsQueue.add('execute', {
            userId,
            problemId,
            code,
            language,
            socketId,
        });

        return { cached: false, jobId: job.id };
    }
}
