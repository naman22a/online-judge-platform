import { configuration, validate } from '@leetcode/config';
import { DatabaseModule } from '@leetcode/database';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompaniesController } from './companies/companies.controller';
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
    controllers: [CompaniesController, PrometheusController],
    providers: [],
})
export class AppModule {}
