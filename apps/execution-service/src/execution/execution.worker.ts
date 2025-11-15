import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { RedisService } from './redis.service';

@Processor('submissions')
export class ExecutionConsumer {
    constructor(private redis: RedisService) {}

    async process(job: Job<any, any, string>): Promise<any> {
        console.table(job.data);
        this.redis.publish(`execute:done:${job.data.socketId}`, JSON.stringify({ data: job.data }));

        return {};
    }
}
