/* eslint-disable */
import { PrismaService } from '@leetcode/database';
import { CreateSubmissionDto } from '@leetcode/types';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { ExecutionService } from './execution.service';
import { Logger } from '@nestjs/common';
import { redis } from '../redis';
import { generateCacheKey } from '../utils';
import { jobExecutionDuration, jobFailures, workersActive } from '../metrics/metrics';

@Processor('execution-queue')
export class ExecutionConsumer extends WorkerHost {
    private readonly CACHE_TTL = 60;

    constructor(
        private prisma: PrismaService,
        private executionService: ExecutionService,
        @InjectQueue('results-queue') private resultsQueue: Queue,
        @InjectQueue('execution-dlq') private dlqQueue: Queue,
    ) {
        super();
    }

    async process(job: Job<any, any, string>) {
        try {
            switch (job.name) {
                case 'execute-job':
                    const { problemId, code, language, userId, idempotencyKey } =
                        job.data as CreateSubmissionDto;

                    const lockKey = `lock:${idempotencyKey}`;
                    const acquired = await redis.set(lockKey, '1', 'PX', 300_000, 'NX');
                    if (!acquired) {
                        Logger.warn(`Job ${job.id} already being processed, skipping`);
                        return;
                    }

                    workersActive.inc();

                    try {
                        const problem = await this.prisma.problem.findUnique({
                            where: { id: problemId },
                            select: { testCases: true },
                        });
                        if (!problem) return;

                        const end = jobExecutionDuration.startTimer();
                        Logger.log('running test cases...');
                        const results = await this.executionService.runTestCases(
                            language,
                            code,
                            // @ts-ignore
                            problem.testCases.map((tc) => ({
                                input: tc.input,
                                output: tc.expectedOutput,
                            })),
                        );
                        Logger.log('done running test cases');
                        end();

                        try {
                            const cacheKey = generateCacheKey(language, code, problemId);
                            await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(results));
                        } catch (cacheError) {
                            console.error('Cache storage error:', cacheError);
                        }

                        await this.resultsQueue.add('result-job', {
                            code,
                            language,
                            problemId,
                            results,
                            userId,
                            idempotencyKey,
                        });
                    } finally {
                        await redis.del(lockKey);
                        workersActive.dec();
                    }
                    break;

                default:
                    break;
            }
        } catch (error) {
            jobFailures.inc();
            Logger.error(`Execution job failed: ${job.id}`, error);
            await this.dlqQueue.add('execution-failed', {
                payload: job.data,
                retries: job.data.retries ?? 0,
            });
            throw error;
        }
    }
}
