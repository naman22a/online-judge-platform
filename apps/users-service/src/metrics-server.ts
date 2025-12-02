import express from 'express';
import { Registry } from 'prom-client';

export function startMetricsServer(registry: Registry, port: number) {
    const app = express();

    app.get('/metrics', async (_req, res) => {
        res.set('Content-Type', registry.contentType);
        res.send(await registry.metrics());
    });

    app.listen(port, () => {
        console.log(`Prometheus metrics on port ${port}/metrics`);
    });
}
