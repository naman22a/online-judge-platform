import 'dotenv/config';
import * as jwt from 'jsonwebtoken';

export function signInternalToken(serviceName: string, scope: string[] = []) {
    return jwt.sign(
        {
            sub: serviceName,
            type: 'service',
            scope,
        },
        process.env.INTERNAL_JWT_SECRET!,
        {
            expiresIn: '10m',
            issuer: process.env.INTERNAL_JWT_ISSUER!,
        },
    );
}
