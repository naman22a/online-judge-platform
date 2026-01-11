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
    Req,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetProblemsQueryDto } from './types';
import { AdminGuard } from '../../guards/admin.guard';
import { CreateProblemDto, UpdateProblemDto } from '@leetcode/types';
import type { Request } from 'express';
import { signInternalToken } from '../../utils';

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

    @Get(':slug')
    getOneProblem(@Param('slug') slug: string) {
        return this.client.send(PROBLEMS.FIND_ONE, { slug });
    }

    @UseGuards(AdminGuard)
    @Post()
    createProblem(@Req() req: Request, @Body() body: CreateProblemDto) {
        const userId = req.userId;
        const internalToken = signInternalToken('api-gateway', ['problems:create']);

        return this.client.send(PROBLEMS.CREATE, {
            internalToken,
            payload: {
                userId,
                dto: body,
            },
        });
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
