import 'dotenv/config';
import {
    Body,
    Controller,
    Inject,
    Param,
    ParseUUIDPipe,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AUTH, COOKIE_NAME, MICROSERVICES } from '@leetcode/constants';
import { ClientProxy } from '@nestjs/microservices';
import { LoginResponse, OkResponse } from '@leetcode/types';
import { firstValueFrom } from 'rxjs';
import type { Request, Response } from 'express';
import { AuthGuard } from '../../guards/auth.guard';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './types';
import { ApiBearerAuth } from '@nestjs/swagger';

const __prod__ = process.env.NODE_ENV === 'production';

@Controller('auth')
export class AuthController {
    constructor(@Inject(MICROSERVICES.AUTH_SERVICE) private client: ClientProxy) {}

    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.client.send(AUTH.REGISTER, body);
    }

    @Post('confirm-email/:token')
    async confirmEmail(@Param('token', new ParseUUIDPipe({ version: '4' })) token: string) {
        return this.client.send(AUTH.CONFIRM_EMAIL, token);
    }

    @Post('login')
    async login(
        @Body() body: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<LoginResponse> {
        const { accessToken, refreshToken, errors } = (await firstValueFrom(
            this.client.send(AUTH.LOGIN, body),
        )) as LoginResponse;

        if (!accessToken) return { accessToken, errors };

        res.cookie(COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: __prod__,
            sameSite: 'lax',
        });
        return { accessToken };
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response): Promise<OkResponse> {
        res.clearCookie(COOKIE_NAME);
        return await firstValueFrom(this.client.send(AUTH.LOGOUT, {}));
    }

    @Post('refresh_token')
    async refreshToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<LoginResponse> {
        const token = req.cookies[COOKIE_NAME];
        const { accessToken, refreshToken, errors } = (await firstValueFrom(
            this.client.send(AUTH.REFRESH_TOKEN, { token }),
        )) as LoginResponse;

        if (!accessToken) return { accessToken, errors };

        res.cookie(COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: __prod__,
            sameSite: 'lax',
        });
        return { accessToken };
    }

    @Post('forgot-password')
    async forgotPassword(@Body() { email }: ForgotPasswordDto) {
        return this.client.send(AUTH.FORGOT_PASSWORD, { email });
    }

    @Post('reset-password/:token')
    async resetPassword(
        @Param('token', new ParseUUIDPipe({ version: '4' })) token: string,
        @Body() { password }: ResetPasswordDto,
    ) {
        return this.client.send(AUTH.RESET_PASSWORD, { token, password });
    }
}
