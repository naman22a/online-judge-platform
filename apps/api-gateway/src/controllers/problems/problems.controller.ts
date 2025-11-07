import { MICROSERVICES, PROBLEMS } from '@leetcode/constants';
import { Controller, Get, Inject, ParseIntPipe, Query, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetProblemsQueryDto } from './types';

@Controller('problems')
export class ProblemsController {
    constructor(@Inject(MICROSERVICES.PROBLEMS_SERVICE) private client: ClientProxy) {}

    @Get()
    getProblems(
        @Query(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                forbidNonWhitelisted: true,
            }),
        )
        query: GetProblemsQueryDto,
    ) {
        return this.client.send(PROBLEMS.FIND_ALL, { query });
    }
}
