/* eslint-disable */
import { PrismaService } from '@leetcode/database';
import { CreateSubmissionDto, ExecutionResult } from '@leetcode/types';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';

@Processor('results-queue')
export class ResultsConsumer extends WorkerHost {
    constructor(
        private prisma: PrismaService,
        @InjectQueue('notifications-queue') private notificationsQueue: Queue,
    ) {
        super();
    }

    async process(job: Job<any, any, string>) {
        switch (job.name) {
            case 'result-job':
                const { results, code, language, problemId, userId, idempotencyKey } =
                    job.data as CreateSubmissionDto & { results: ExecutionResult[] };

                Logger.log(
                    `result-job received, idempotencyKey: ${idempotencyKey}, userId: ${userId}`,
                );

                let correct = true;
                for (const result of results) {
                    correct = correct && result.success;
                }

                try {
                    await this.prisma.submission.update({
                        where: {
                            userId_idempotencyKey: {
                                userId,
                                idempotencyKey: idempotencyKey!,
                            },
                        },
                        data: {
                            status: correct ? 'Accepted' : 'WrongAnswer',
                        },
                    });
                    Logger.log(`DB updated successfully`);
                } catch (e) {
                    Logger.error(`DB update failed: ${e}`);
                }

                await this.notificationsQueue.add('execution-done', { results, idempotencyKey });
                Logger.log(`notification queued`);
                break;

            default:
                break;
        }
    }
}
