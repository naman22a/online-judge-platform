import { PrismaService } from '@leetcode/database';
import { CreateSubmissionDto, ExecutionResult } from '@leetcode/types';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
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
                const { results, code, language, problemId, userId } =
                    job.data as CreateSubmissionDto & { results: ExecutionResult[] };

                let correct = true;
                for (const result of results) {
                    correct = correct && result.success;
                }

                await this.prisma.submission.create({
                    data: {
                        code,
                        language,
                        problemId,
                        status: correct ? 'Accepted' : 'WrongAnswer',
                        userId,
                    },
                });

                this.notificationsQueue.add('execution-done', results);

                break;

            default:
                break;
        }
    }
}
