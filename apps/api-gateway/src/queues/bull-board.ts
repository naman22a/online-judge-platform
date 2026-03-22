import { Queue } from 'bullmq';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

export function setupBullBoard(
    executionQueue: Queue,
    resultsQueue: Queue,
    notificationsQueue: Queue,
    dlqQueue: Queue,
) {
    const serverAdapter = new ExpressAdapter();

    serverAdapter.setBasePath('/queues');

    createBullBoard({
        queues: [
            new BullMQAdapter(executionQueue),
            new BullMQAdapter(resultsQueue),
            new BullMQAdapter(notificationsQueue),
            new BullMQAdapter(dlqQueue),
        ],
        serverAdapter,
    });

    return serverAdapter;
}
