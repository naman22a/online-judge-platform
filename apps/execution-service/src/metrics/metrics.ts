import { Counter, Gauge, Histogram, Registry } from 'prom-client';

export const register = new Registry();

/* =========================
   Queue Metrics
========================= */

export const queueCompleted = new Counter({
    name: 'oj_queue_completed_total',
    help: 'Completed execution jobs',
    labelNames: ['queue'],
    registers: [register],
});

export const queueFailed = new Counter({
    name: 'oj_queue_failed_total',
    help: 'Failed execution jobs',
    labelNames: ['queue'],
    registers: [register],
});

export const queueWaiting = new Gauge({
    name: 'oj_queue_waiting',
    help: 'Jobs waiting in queue',
    labelNames: ['queue'],
    registers: [register],
});

export const queueDelayed = new Gauge({
    name: 'oj_queue_delayed',
    help: 'Delayed jobs',
    labelNames: ['queue'],
    registers: [register],
});

export const workersActive = new Gauge({
    name: 'oj_workers_active',
    help: 'Currently active workers',
    labelNames: ['queue'],
    registers: [register],
});

/* =========================
   Execution Metrics
========================= */

export const executionDuration = new Histogram({
    name: 'oj_execution_duration_seconds',
    help: 'Code execution duration',
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
    registers: [register],
});

export const verdicts = new Counter({
    name: 'oj_verdicts_total',
    help: 'Execution verdicts',
    labelNames: ['verdict'],
    registers: [register],
});

/* =========================
   Kubernetes Metrics
========================= */

export const k8sJobCreationDuration = new Histogram({
    name: 'oj_k8s_job_creation_seconds',
    help: 'Kubernetes Job creation latency',
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
    registers: [register],
});

export const k8sJobsRunning = new Gauge({
    name: 'oj_k8s_jobs_running',
    help: 'Running execution jobs',
    registers: [register],
});

/* =========================
   Reliability Metrics
========================= */

export const redisLockFailures = new Counter({
    name: 'oj_redis_lock_failures_total',
    help: 'Failed distributed lock acquisitions',
    registers: [register],
});

export const dlqJobs = new Counter({
    name: 'oj_dlq_jobs_total',
    help: 'Jobs moved to DLQ',
    registers: [register],
});

export const dlqRetries = new Counter({
    name: 'oj_dlq_retries_total',
    help: 'DLQ retries',
    registers: [register],
});
