import { MICROSERVICES, SUBMISSIONS } from '@leetcode/constants';
import { Controller, Get, Inject, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../../guards/auth.guard';
import type { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('submissions')
export class SubmissionsController {
    constructor(@Inject(MICROSERVICES.SUBMISSIONS_SERVICE) private client: ClientProxy) {}

    @Get(':id')
    findAll(@Req() req: Request, @Param('id', ParseIntPipe) problemId: number) {
        const userId = req.userId;
        return this.client.send(SUBMISSIONS.FIND_ALL, { userId, problemId });
    }
}
