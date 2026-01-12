import { PrismaService } from '@leetcode/database';
import { CreateSubmissionDto } from '@leetcode/types';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { ExecutionService } from './execution.service';
import { Logger } from '@nestjs/common';
import { redis } from '../redis';
import { generateCacheKey } from '../utils';

@Processor('execution-queue')
export class ExecutionConsumer extends WorkerHost {
    private readonly CACHE_TTL = 60 * 60 * 24;

    constructor(
        private prisma: PrismaService,
        private executionService: ExecutionService,
        @InjectQueue('results-queue') private resultsQueue: Queue,
    ) {
        super();
    }

    async process(job: Job<any, any, string>) {
        switch (job.name) {
            case 'execute-job':
                const { problemId, code, language, userId } = job.data as CreateSubmissionDto;
                const problem = await this.prisma.problem.findUnique({
                    where: { id: problemId },
                    select: { testCases: true },
                });

                if (!problem) return;

                Logger.log('running test cases...');
                const results = await this.executionService.runTestCases(
                    language,
                    code,
                    problem.testCases.map((tc) => ({
                        input: tc.input,
                        output: tc.expectedOutput,
                    })),
                );
                Logger.log('done running test cases');

                try {
                    const cacheKey = generateCacheKey(language, code, problemId);
                    const cacheValue = results;

                    await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(cacheValue));
                } catch (cacheError) {
                    console.error('Cache storage error:', cacheError);
                }

                this.resultsQueue.add('result-job', { code, language, problemId, results, userId });
                break;

            default:
                break;
        }
    }
}
