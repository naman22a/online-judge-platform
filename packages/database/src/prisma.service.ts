import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'event', level: 'error' },
                { emit: 'event', level: 'warn' },
            ],
        });
    }

    async onModuleInit() {
        this.logger.log('Connecting to database...');

        this.$on('query' as never, (e: any) => {
            this.logger.debug(`Query: ${e.query}`);
            this.logger.debug(`Duration: ${e.duration}ms`);
        });

        await this.$connect();
        this.logger.log('Database connected successfully');
    }

    async onModuleDestroy() {
        this.logger.log('Disconnecting from database...');
        await this.$disconnect();
    }
}
