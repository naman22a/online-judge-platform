import { Counter, Gauge, Histogram } from 'prom-client';

export const jobExecutionDuration = new Histogram({
    name: 'bullmq_job_duration_seconds',
    help: 'Job execution duration',
    labelNames: ['queue'],
    buckets: [0.1, 0.5, 1, 2, 5, 10],
});

export const jobFailures = new Counter({
    name: 'bullmq_queue_failed',
    help: 'Total failed jobs',
    labelNames: ['queue'],
});

export const workersActive = new Gauge({
    name: 'bullmq_queue_active',
    help: 'Active workers processing jobs',
    labelNames: ['queue'],
});
