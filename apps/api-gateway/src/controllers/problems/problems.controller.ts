import { MICROSERVICES, PROBLEMS } from '@leetcode/constants';
import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetProblemsQueryDto } from './types';
import { AdminGuard } from '../../guards/admin.guard';
import { CreateProblemDto, UpdateProblemDto } from '@leetcode/types';

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

    @Get(':id')
    getOneProblem(@Param('id', ParseIntPipe) id: number) {
        return this.client.send(PROBLEMS.FIND_ONE, { id });
    }

    @UseGuards(AdminGuard)
    @Post()
    createProblem(@Body() body: CreateProblemDto) {
        return this.client.send(PROBLEMS.CREATE, body);
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    deleteOneProblem(@Param('id', ParseIntPipe) id: number) {
        return this.client.send(PROBLEMS.DELETE, { id });
    }

    @UseGuards(AdminGuard)
    @Patch(':id')
    updateProblem(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProblemDto) {
        return this.client.send(PROBLEMS.UPDATE, { id, dto });
    }
}
