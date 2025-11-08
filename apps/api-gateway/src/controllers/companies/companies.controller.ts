import { COMPANIES, MICROSERVICES } from '@leetcode/constants';
import { BulkCreateCompaniesDto } from '@leetcode/types';
import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

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

    @Post('bulk')
    create(@Body() body: BulkCreateCompaniesDto) {
        return this.client.send(COMPANIES.CREATE, { dto: body });
    }
}
