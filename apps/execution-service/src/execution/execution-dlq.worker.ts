import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('execution-dlq')
export class ExecutionDLQConsumer extends WorkerHost {
    constructor(
        @InjectQueue('execution-queue')
        private executionQueue: Queue,
    ) {
        super();
    }

    async process(job: Job) {
        const { payload, retries = 0 } = job.data;

        Logger.warn(`DLQ received job ${job.id}, retry count: ${retries}`);

        if (retries < 1) {
            // Retry once
            await this.executionQueue.add('execute-job', payload, {
                attempts: 1,
            });

            Logger.log(`Retrying job ${job.id} from DLQ`);

            return;
        }

        // Final failure
        Logger.error(`Job permanently failed: ${job.id}`);
    }
}
