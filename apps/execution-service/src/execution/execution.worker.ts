import { PrismaService } from '@leetcode/database';
import { CreateSubmissionDto } from '@leetcode/types';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { ExecutionService } from './execution.service';

@Processor('execution-queue')
export class ExecutionConsumer extends WorkerHost {
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

                const results = await this.executionService.runTestCases(
                    language,
                    code,
                    problem.testCases.map((tc) => ({
                        input: tc.input,
                        output: tc.expectedOutput,
                    })),
                );

                this.resultsQueue.add('result-job', { code, language, problemId, results, userId });
                break;

            default:
                break;
        }
    }
}
