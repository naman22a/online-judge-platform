import { Module } from '@nestjs/common';
import { ProblemsController } from './problems/problems.controller';
import { DatabaseModule } from '@leetcode/database';

@Module({
    imports: [DatabaseModule],
    controllers: [ProblemsController],
    providers: [],
})
export class AppModule {}
