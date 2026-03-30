import express from 'express';
import { register } from './metrics/metrics';

export function startMetricsServer(port: number) {
    const app = express();

    app.get('/metrics', async (_req, res) => {
        res.set('Content-Type', register.contentType);
        res.send(await register.metrics());
    });

    app.listen(port, () => {
        console.log(`Prometheus metrics on port ${port}/metrics`);
    });
}
