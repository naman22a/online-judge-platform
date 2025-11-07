import { MICROSERVICES, TAGS } from '@leetcode/constants';
import { BulkCreateTagsDto } from '@leetcode/types';
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

@Controller('tags')
export class TagsController {
    constructor(@Inject(MICROSERVICES.TAGS_SERVICE) private client: ClientProxy) {}

    @Get()
    findAllTags() {
        return this.client.send(TAGS.FIND_ALL, {});
    }

    @Get(':id')
    findOneTag(@Param('id', ParseIntPipe) id: number) {
        return this.client.send(TAGS.FIND_ONE, { id });
    }

    @UseGuards(AdminGuard)
    @Post('bulk')
    createTag(@Body() body: BulkCreateTagsDto) {
        return this.client.send(TAGS.CREATE, body);
    }
}
