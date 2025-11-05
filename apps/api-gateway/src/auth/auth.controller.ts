import { AUTH, MICROSERVICES } from '@leetcode/constants';
import { Body, Controller, Inject, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;
}

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
}
