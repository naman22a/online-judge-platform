import { Gauge, register } from 'prom-client';

export const queueDepth = new Gauge({
    name: 'bullmq_queue_waiting',
    help: 'Jobs waiting in queue',
    labelNames: ['queue'],
});
export { register };
