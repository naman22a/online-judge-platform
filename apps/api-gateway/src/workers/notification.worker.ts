import { ExecutionResult } from '@leetcode/types';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EventsGateway } from '../gateways/events.gateway';
import { redis } from '../redis';

@Processor('notifications-queue')
export class NotificationConsumer extends WorkerHost {
    constructor(private readonly eventsGateway: EventsGateway) {
        super();
    }

    // eslint-disable-next-line
    async process(job: Job<any, any, string>) {
        switch (job.name) {
            case 'execution-done':
                // eslint-disable-next-line
                const data = job.data as ExecutionResult & { idempotencyKey?: string };

                if (data.idempotencyKey) {
                    await redis.set(
                        `idempotency:${data.idempotencyKey}`,
                        JSON.stringify(data),
                        'EX',
                        86400,
                    );
                }

                this.eventsGateway.server.emit('execution-done', data);
                break;

            default:
                break;
        }
    }
}
