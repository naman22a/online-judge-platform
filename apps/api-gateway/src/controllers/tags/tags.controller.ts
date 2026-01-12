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
import { signInternalToken } from '../../utils';
import { Throttle } from '@nestjs/throttler';

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

    @Throttle({ default: { limit: 5, ttl: 60_000 } })
    @UseGuards(AdminGuard)
    @Post('bulk')
    createTag(@Body() body: BulkCreateTagsDto) {
        const internalToken = signInternalToken('api-gateway', ['tags:create']);
        return this.client.send(TAGS.CREATE, { internalToken, payload: body });
    }
}
