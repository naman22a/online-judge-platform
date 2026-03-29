import { MICROSERVICES, PROBLEMS, SUBMISSIONS } from '@leetcode/constants';
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { PrismaService, Problem } from '@leetcode/database';
import type { CreateSubmissionDto, InternalMessage } from '@leetcode/types';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { InternalAuth } from '@leetcode/common';
import { firstValueFrom } from 'rxjs';
import { generateCacheKey } from '../utils';
import { redis } from '../redis';

@Controller()
export class SubmissionsController {
    constructor(
        private prisma: PrismaService,
        @InjectQueue('execution-queue') private executionQueue: Queue,
        @Inject(MICROSERVICES.PROBLEMS_SERVICE) private client: ClientProxy,
        @InjectQueue('notifications-queue') private notificationsQueue: Queue,
    ) {}

    @InternalAuth('submissions:findAll')
    @MessagePattern(SUBMISSIONS.FIND_ALL)
    async findAll({
        payload: { userId, problemId },
    }: InternalMessage<{ userId: number; problemId: number }>) {
        return await this.prisma.submission.findMany({
            where: { problemId: problemId, userId: userId },
        });
    }

    @InternalAuth('submissions:create')
    @MessagePattern(SUBMISSIONS.CREATE)
    async create({
        payload: { code, language, socketId, problemId, userId, idempotencyKey },
    }: InternalMessage<CreateSubmissionDto>) {
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

        const problemExists = (await firstValueFrom(
            this.client.send(PROBLEMS.FIND_ONE_BY_ID, {
                id: problemId,
            }),
        )) as Problem;
        if (!problemExists)
            return { jobId: null, errors: [{ field: 'problemId', message: 'problem not found' }] };

        try {
            const cacheKey = generateCacheKey(language, code, problemId);
            const cachedResult = await redis.get(cacheKey);

            if (cachedResult) {
                const results = JSON.parse(cachedResult);

                let correct = true;
                for (const result of results) {
                    correct = correct && result.success;
                }

                // create DB record
                // eslint-disable-next-line
                let submission: any;
                try {
                    submission = await this.prisma.submission.create({
                        data: {
                            code,
                            language,
                            problemId,
                            userId,
                            status: correct ? 'Accepted' : 'WrongAnswer',
                            idempotencyKey,
                        },
                    });
                    // eslint-disable-next-line
                } catch (e: any) {
                    if (e?.code === 'P2002') {
                        submission = await this.prisma.submission.findFirst({
                            where: { userId, idempotencyKey },
                        });
                        return { jobId: null, cached: true, submissionId: submission?.id };
                    }
                    throw e;
                }

                // skip execution queue, go directly to notifications
                await this.notificationsQueue.add('execution-done', { results, idempotencyKey });

                return {
                    jobId: null,
                    cached: true,
                    submissionId: submission.id,
                };
            }
        } catch (error) {
            console.error('Cache error:', error);
        }

        // eslint-disable-next-line
        let submission: any;
        try {
            submission = await this.prisma.submission.create({
                data: {
                    code,
                    language,
                    problemId,
                    userId,
                    status: 'Pending',
                    idempotencyKey,
                },
            });
            // eslint-disable-next-line
        } catch (e: any) {
            if (e?.code === 'P2002') {
                const existing = await this.prisma.submission.findFirst({
                    where: { userId, idempotencyKey },
                });
                return { jobId: null, submissionId: existing?.id };
            }
            throw e;
        }

        // push job into execution queue
        const job = await this.executionQueue.add(
            'execute-job',
            {
                code,
                language,
                problemId,
                socketId,
                userId,
                idempotencyKey,
            },
            {
                jobId: idempotencyKey,
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000,
                },
            },
        );

        return { jobId: job.id, cached: false, submissionId: submission.id };
    }
}
