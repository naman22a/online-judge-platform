import { Counter, Gauge, register } from 'prom-client';

export const submissionsTotal = new Counter({
    name: 'bullmq_queue_completed',
    help: 'Total completed jobs',
    labelNames: ['queue'],
});

export const queueDepth = new Gauge({
    name: 'bullmq_queue_waiting',
    help: 'Jobs waiting in queue',
    labelNames: ['queue'],
});
export { register };
