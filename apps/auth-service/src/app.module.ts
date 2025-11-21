import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { configuration, validate } from '@leetcode/config';
import { DatabaseModule } from '@leetcode/database';
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
        AuthModule,
        MailModule,
        PrometheusModule.register(),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
