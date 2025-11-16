import { ExecutionResult } from '@leetcode/types';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EventsGateway } from '../gateways/events.gateway';

@Processor('results-queue')
export class NotificationConsumer extends WorkerHost {
    constructor(private readonly eventsGateway: EventsGateway) {
        super();
    }

    async process(job: Job<any, any, string>) {
        switch (job.name) {
            case 'execution-done':
                const data = job.data as ExecutionResult;
                this.eventsGateway.server.emit('execution-done', data);
                break;

            default:
                break;
        }
    }
}
