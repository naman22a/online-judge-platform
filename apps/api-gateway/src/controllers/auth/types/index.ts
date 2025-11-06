import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'test', description: 'username of the user' })
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'test@test.com', description: 'email of the user' })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password123',
        description: 'password of the user',
        minLength: 6,
    })
    @MinLength(6)
    password: string;
}

export class LoginDto {
    @ApiProperty({ example: 'test@test.com', description: 'email of the user' })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password123',
        description: 'password of the user',
    })
    @IsNotEmpty()
    password: string;
}

export class ForgotPasswordDto {
    @ApiProperty({ example: 'test@test.com', description: 'email of the user' })
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @ApiProperty({
        example: 'password123',
        description: 'password of the user',
        minLength: 6,
    })
    @MinLength(6)
    password: string;
}
