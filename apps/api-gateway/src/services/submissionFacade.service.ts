import { MICROSERVICES, SUBMISSIONS } from '@leetcode/constants';
import { CreateSubmissionDto } from '@leetcode/types';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { redis } from '../redis';
import { signInternalToken } from '../utils';

@Injectable()
export class SubmissionFacade {
    constructor(
        @Inject(MICROSERVICES.SUBMISSIONS_SERVICE)
        private readonly client: ClientProxy,
    ) {}

    async submit(data: CreateSubmissionDto) {
        const { idempotencyKey } = data;

        if (idempotencyKey) {
            const cached = await redis.get(`idempotency:${idempotencyKey}`);

            if (cached && cached !== '"pending"') {
                return JSON.parse(cached);
            }

            await redis.set(`idempotency:${idempotencyKey}`, '"pending"', 'EX', 86400, 'NX');
        }

        const internalToken = signInternalToken('api-gateway', ['submissions:create']);

        return this.client.send(SUBMISSIONS.CREATE, {
            internalToken,
            payload: data,
        });
    }
}
