import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { configuration, validate } from '@leetcode/config';
import { DatabaseModule } from '@leetcode/database';

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
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
