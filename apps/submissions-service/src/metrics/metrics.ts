import { Counter, Gauge, Histogram, Registry } from 'prom-client';

export const register = new Registry();

/* =========================
   Submission Metrics
========================= */

export const submissionsReceived = new Counter({
    name: 'oj_submissions_received_total',
    help: 'Total submissions received',
    registers: [register],
});

export const duplicateSubmissions = new Counter({
    name: 'oj_duplicate_submissions_total',
    help: 'Duplicate submissions detected',
    registers: [register],
});

export const submissionsQueued = new Counter({
    name: 'oj_submissions_queued_total',
    help: 'Submissions sent to execution queue',
    registers: [register],
});

/* =========================
   Database Metrics
========================= */

export const dbWriteDuration = new Histogram({
    name: 'oj_db_write_duration_seconds',
    help: 'Submission database write latency',
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
    registers: [register],
});

export const dbUpdateDuration = new Histogram({
    name: 'oj_db_update_duration_seconds',
    help: 'Result update latency',
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
    registers: [register],
});

/* =========================
   Results Metrics
========================= */

export const resultsConsumed = new Counter({
    name: 'oj_results_consumed_total',
    help: 'Results consumed from results queue',
    registers: [register],
});

export const verdictsPersisted = new Counter({
    name: 'oj_verdicts_persisted_total',
    help: 'Verdicts persisted to database',
    labelNames: ['verdict'],
    registers: [register],
});

/* =========================
   Notifications
========================= */

export const notificationsPublished = new Counter({
    name: 'oj_notifications_published_total',
    help: 'Notifications published',
    registers: [register],
});

/* =========================
   Queue Metrics
========================= */

export const resultsQueueLag = new Gauge({
    name: 'oj_results_queue_waiting',
    help: 'Results waiting in queue',
    registers: [register],
});

/* =========================
   Extra
========================= */

export const cacheHits = new Counter({
    name: 'oj_cache_hits_total',
    help: 'Submission cache hits',
    registers: [register],
});

export const submissionQueueWaiting = new Gauge({
    name: 'oj_submission_queue_waiting',
    help: 'Waiting submissions',
    registers: [register],
});
