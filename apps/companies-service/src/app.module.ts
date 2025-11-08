import { configuration, validate } from '@leetcode/config';
import { DatabaseModule } from '@leetcode/database';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompaniesController } from './companies/companies.controller';

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
    controllers: [CompaniesController],
    providers: [],
})
export class AppModule {}
