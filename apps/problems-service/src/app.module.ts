import { Module } from '@nestjs/common';
import { ProblemsController } from './problems/problems.controller';
import { DatabaseModule } from '@leetcode/database';
import { ConfigModule } from '@nestjs/config';
import { configuration, validate } from '@leetcode/config';
import { ProblemsService } from './problems/problems.service';
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
    controllers: [ProblemsController, PrometheusController],
    providers: [ProblemsService],
})
export class AppModule {}
