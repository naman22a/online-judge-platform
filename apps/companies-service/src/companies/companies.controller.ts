import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { COMPANIES } from '@leetcode/constants';
import { PrismaService } from '@leetcode/database';
import { BulkCreateCompaniesDto } from '@leetcode/types';

@Controller('companies')
export class CompaniesController {
    constructor(private prisma: PrismaService) {}

    @MessagePattern(COMPANIES.FIND_ALL)
    async findAll() {
        return await this.prisma.company.findMany();
    }

    @MessagePattern(COMPANIES.FIND_ONE)
    async findOne({ id }: { id: number }) {
        const company = await this.prisma.company.findUnique({ where: { id } });
        if (!company) return { ok: false, errors: [{ field: 'id', message: 'company not found' }] };
        return company;
    }

    @MessagePattern(COMPANIES.CREATE)
    async create({ dto }: { dto: BulkCreateCompaniesDto }) {
        return await this.prisma.company.createMany({
            data: dto.companies,
            skipDuplicates: true,
        });
    }
}
