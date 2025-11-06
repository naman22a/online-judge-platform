import { Module } from '@nestjs/common';
import { ProblemsController } from './problems/problems.controller';
import { DatabaseModule } from '@leetcode/database';
import { ConfigModule } from '@nestjs/config';
import { configuration, validate } from '@leetcode/config';

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
    ],
    controllers: [ProblemsController],
    providers: [],
})
export class AppModule {}
