import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('execution-queue')
export class ExecutionConsumer extends WorkerHost {
    async process(job: Job<any, any, string>): Promise<any> {
        console.log('Received job:', job.data);
        return true;
    }
}
