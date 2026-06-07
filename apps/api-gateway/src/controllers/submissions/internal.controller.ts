import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SubmissionFacade } from '../../services/submissionFacade.service';
import { CreateSubmissionDto } from '@leetcode/types';
import { AdminGuard } from '../../guards/admin.guard';

@UseGuards(AdminGuard)
@Controller('internal')
export class InternalController {
    constructor(private readonly submissionFacade: SubmissionFacade) {}

    @Post('submit')
    async submit(@Body() dto: CreateSubmissionDto) {
        return this.submissionFacade.submit(dto);
    }
}
