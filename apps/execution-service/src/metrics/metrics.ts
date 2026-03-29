import { Counter, Gauge, Histogram } from 'prom-client';

export const jobExecutionDuration = new Histogram({
    name: 'job_execution_duration_seconds',
    help: 'Execution duration of jobs',
    buckets: [0.1, 0.5, 1, 2, 5, 10],
});

export const jobFailures = new Counter({
    name: 'job_failures_total',
    help: 'Total failed jobs',
});

export const workersActive = new Gauge({
    name: 'execution_workers_active',
    help: 'Number of active execution workers',
});
