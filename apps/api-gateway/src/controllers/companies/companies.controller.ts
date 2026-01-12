import { COMPANIES, MICROSERVICES } from '@leetcode/constants';
import { BulkCreateCompaniesDto } from '@leetcode/types';
import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AdminGuard } from '../../guards/admin.guard';
import { signInternalToken } from '../../utils';

@Controller('companies')
export class CompaniesController {
    constructor(@Inject(MICROSERVICES.COMPANIES_SERVICE) private client: ClientProxy) {}

    @Get()
    findAll() {
        return this.client.send(COMPANIES.FIND_ALL, {});
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.client.send(COMPANIES.FIND_ONE, { id });
    }

    @UseGuards(AdminGuard)
    @Post('bulk')
    create(@Body() body: BulkCreateCompaniesDto) {
        const internalToken = signInternalToken('api-gateway', ['companies:create']);
        return this.client.send(COMPANIES.CREATE, { internalToken, payload: { dto: body } });
    }
}
