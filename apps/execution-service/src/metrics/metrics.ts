import { Counter, Gauge, Histogram, Registry } from 'prom-client';

export const register = new Registry();

export const jobExecutionDuration = new Histogram({
    name: 'bullmq_job_duration_seconds',
    help: 'Job execution duration',
    labelNames: ['queue'],
    buckets: [0.1, 0.5, 1, 2, 5, 10],
    registers: [register],
});

export const jobFailures = new Counter({
    name: 'bullmq_queue_failed',
    help: 'Total failed jobs',
    labelNames: ['queue'],
    registers: [register],
});

export const workersActive = new Gauge({
    name: 'bullmq_queue_active',
    help: 'Active workers processing jobs',
    labelNames: ['queue'],
    registers: [register],
});

export const submissionsTotal = new Counter({
    name: 'bullmq_queue_completed',
    help: 'Total completed jobs',
    labelNames: ['queue'],
    registers: [register],
});
