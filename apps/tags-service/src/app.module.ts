import { configuration, validate } from '@leetcode/config';
import { DatabaseModule } from '@leetcode/database';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TagsController } from './tags/tags.controller';
import { PrometheusController, PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            expandVariables: true,
            load: [configuration],
            validate,
        }),
        DatabaseModule,
        PrometheusModule.register(),
    ],
    controllers: [TagsController, PrometheusController],
    providers: [],
})
export class AppModule {}
