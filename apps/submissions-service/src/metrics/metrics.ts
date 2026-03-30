import { Gauge, Registry } from 'prom-client';

export const register = new Registry();

export const queueDepth = new Gauge({
    name: 'bullmq_queue_waiting',
    help: 'Jobs waiting in queue',
    labelNames: ['queue'],
    registers: [register],
});
