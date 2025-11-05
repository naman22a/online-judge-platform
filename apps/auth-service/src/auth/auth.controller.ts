import { PrismaService } from '@leetcode/database';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OkResponse, RegisterDto } from './types';
import * as argon2 from 'argon2';
import { MailService } from '../mail/mail.service';
import { redis } from '../redis';
import { CONFIRMATION_PREFIX } from '../constants';

@Controller('auth')
export class AuthController {
    constructor(
        private prisma: PrismaService,
        private mailService: MailService,
    ) {}

    @MessagePattern('auth.register')
    async register(registerDto: RegisterDto): Promise<OkResponse> {
        const { username, email, password } = registerDto;

        // check if username is taken
        const usernameExists = await this.prisma.user.findUnique({ where: { username } });
        if (usernameExists) {
            return {
                ok: false,
                errors: [
                    {
                        field: 'username',
                        message: 'username already taken',
                    },
                ],
            };
        }

        // check if email is taken
        const emailExists = await this.prisma.user.findUnique({ where: { email } });
        if (emailExists) {
            return {
                ok: false,
                errors: [
                    {
                        field: 'email',
                        message: 'email already taken',
                    },
                ],
            };
        }

        // hash the password
        const hashedPassword = await argon2.hash(password);

        // save user to database
        const user = await this.prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        // send confirmation email
        const metadata = await this.mailService.createConfirmationMetadata(user.id);
        await this.mailService.sendEmail(email, metadata);

        return { ok: true };
    }

    @MessagePattern('auth.confirmEmail')
    async confirmEmail(token: string) {
        if (!token) return { ok: false };

        // get userId from redis
        const userId = await redis.get(CONFIRMATION_PREFIX + token);
        if (!userId) return { ok: false };

        // check if user exists in database
        const user = await this.prisma.user.findUnique({ where: { id: parseInt(userId, 10) } });
        if (!user) return { ok: false };

        // verify the user
        await this.prisma.user.update({
            where: { id: user.id },
            data: { emailVerfied: true },
        });

        // delete token from redis
        await redis.del(CONFIRMATION_PREFIX + token);

        return { ok: true };
    }
}
