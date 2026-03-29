import { Counter, Gauge, register } from 'prom-client';

export const submissionsTotal = new Counter({
    name: 'submissions_total',
    help: 'Total submissions received',
});

export const queueDepth = new Gauge({
    name: 'queue_depth',
    help: 'Number of jobs waiting in queue',
});

export { register };
