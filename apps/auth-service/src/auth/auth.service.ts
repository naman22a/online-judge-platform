import { User } from '@leetcode/database';
import { AccessTokenPayload, RefreshTokenPayload } from '@leetcode/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(private configService: ConfigService) {}

    createAcessToken(user: User) {
        const secret = this.configService.get('ACCESS_TOKEN_SECRET');
        return sign({ userId: user.id } as AccessTokenPayload, secret, {
            expiresIn: '15m',
        });
    }

    createRefreshToken(user: User) {
        const secret = this.configService.get('REFRESH_TOKEN_SECRET');
        return sign(
            {
                userId: user.id,
                tokenVersion: user.tokenVersion,
            } as RefreshTokenPayload,
            secret,
            { expiresIn: '7d' },
        );
    }
}
