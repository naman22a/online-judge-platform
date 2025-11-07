import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TAGS } from '@leetcode/constants';
import { PrismaService } from '@leetcode/database';
import { BulkCreateTagsDto } from '@leetcode/types';

@Controller('tags')
export class TagsController {
    constructor(private prisma: PrismaService) {}

    @MessagePattern(TAGS.FIND_ALL)
    async findAll() {
        return await this.prisma.tag.findMany();
    }

    @MessagePattern(TAGS.FIND_ONE)
    async findOne({ id }: { id: number }) {
        const tag = await this.prisma.tag.findUnique({ where: { id } });
        if (!tag) return { ok: false, errors: [{ field: 'id', message: 'tag not found' }] };
        return tag;
    }

    @MessagePattern(TAGS.CREATE)
    async create({ tags }: BulkCreateTagsDto) {
        return await this.prisma.tag.createMany({
            data: tags,
            skipDuplicates: true,
        });
    }
}
