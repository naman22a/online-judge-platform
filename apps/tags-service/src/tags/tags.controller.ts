import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TAGS } from '@leetcode/constants';
import { PrismaService } from '@leetcode/database';
import type { BulkCreateTagsDto, InternalMessage } from '@leetcode/types';
import { InternalAuth } from '@leetcode/common';

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

    @InternalAuth('tags:create')
    @MessagePattern(TAGS.CREATE)
    async create({ payload }: InternalMessage<BulkCreateTagsDto>) {
        return await this.prisma.tag.createMany({
            data: payload.tags,
            skipDuplicates: true,
        });
    }
}
