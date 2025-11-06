import { PrismaService } from '@leetcode/database';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LoginDto, RegisterDto } from './types';
import * as argon2 from 'argon2';
import { MailService } from '../mail/mail.service';
import { redis } from '../redis';
import { CONFIRMATION_PREFIX, FORGOT_PASSWORD_PREFIX } from '../constants';
import { AUTH } from '@leetcode/constants';
import { LoginResponse, OkResponse, RefreshTokenPayload } from '@leetcode/types';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
    constructor(
        private prisma: PrismaService,
        private mailService: MailService,
        private authService: AuthService,
        private configService: ConfigService,
    ) {}

    @MessagePattern(AUTH.REGISTER)
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

    @MessagePattern(AUTH.CONFIRM_EMAIL)
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

    @MessagePattern(AUTH.LOGIN)
    async login(dto: LoginDto): Promise<LoginResponse> {
        const { email, password } = dto;

        // check if user exists in database
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return {
                accessToken: '',
                errors: [{ field: 'email', message: 'User not found.' }],
            };
        }

        // check if password is correct
        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return {
                accessToken: '',
                errors: [{ field: 'password', message: 'Incorrect Password.' }],
            };
        }

        // check is user is verified
        if (!user.emailVerfied) {
            return {
                accessToken: '',
                errors: [{ field: 'email', message: 'Please verify your email.' }],
            };
        }

        // send access and refresh tokens
        const accessToken = this.authService.createAcessToken(user);
        const refreshToken = this.authService.createRefreshToken(user);

        return { accessToken, refreshToken };
    }

    @MessagePattern(AUTH.LOGOUT)
    logout(): OkResponse {
        return { ok: true };
    }

    @MessagePattern(AUTH.REFRESH_TOKEN)
    async refreshToken({ token }: { token: string }): Promise<LoginResponse> {
        const secret = this.configService.get('REFRESH_TOKEN_SECRET');

        // check if token exists
        if (!token) return { accessToken: '' };

        let payload: RefreshTokenPayload | null = null;

        try {
            // decode the token
            payload = verify(token, secret) as RefreshTokenPayload;
        } catch (error) {
            console.error(error);
            return { accessToken: '' };
        }

        // check if user exists
        const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user) return { accessToken: '' };

        // check if token version of user and jwt are equal
        if (user.tokenVersion !== payload.tokenVersion) {
            return { accessToken: '' };
        }

        // send access and refresh tokens
        const accessToken = this.authService.createAcessToken(user);
        const refreshToken = this.authService.createRefreshToken(user);

        return { accessToken, refreshToken };
    }

    @MessagePattern(AUTH.FORGOT_PASSWORD)
    async forgotPassword({ email }: { email: string }) {
        // check if user exists
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) return { ok: true };

        // send forgot password email
        const metadata = await this.mailService.createForgotpasswordMetadata(user.id);
        await this.mailService.sendEmail(email, metadata);

        return { ok: true };
    }

    @MessagePattern(AUTH.RESET_PASSWORD)
    async resetPassword({ token, password }: { token: string; password: string }) {
        if (!token) return { ok: false };

        // find user id in redis
        const userId = await redis.get(FORGOT_PASSWORD_PREFIX + token);
        if (!userId) return { ok: false };

        // check if user exists for the found user id
        const user = await this.prisma.user.findUnique({ where: { id: parseInt(userId, 10) } });
        if (!user) return { ok: false };

        // hash the password
        const hashedPassword = await argon2.hash(password);

        // update user password
        await this.prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        // increment token version
        await this.prisma.user.update({
            where: { id: user.id },
            data: { tokenVersion: { increment: 1 } },
        });

        // delete token from redis
        await redis.del(FORGOT_PASSWORD_PREFIX + token);

        return { ok: true };
    }
}
