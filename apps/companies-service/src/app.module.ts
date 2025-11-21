import { configuration, validate } from '@leetcode/config';
import { DatabaseModule } from '@leetcode/database';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompaniesController } from './companies/companies.controller';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

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
    controllers: [CompaniesController],
    providers: [],
})
export class AppModule {}
