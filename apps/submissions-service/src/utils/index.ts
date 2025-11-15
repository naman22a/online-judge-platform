import crypto from 'crypto';

export function getHash(s: string) {
    return crypto.createHash('sha256').update(s).digest('hex');
}
