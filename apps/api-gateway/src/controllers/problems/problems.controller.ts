import { MICROSERVICES, PROBLEMS } from '@leetcode/constants';
import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    Query,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetProblemsQueryDto } from './types';
import { AdminGuard } from '../../guards/admin.guard';
import { CreateProblemDto } from '@leetcode/types';

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

    @UseGuards(AdminGuard)
    @Post()
    async createProblem(@Body() body: CreateProblemDto) {
        return this.client.send(PROBLEMS.CREATE, body);
    }
}
