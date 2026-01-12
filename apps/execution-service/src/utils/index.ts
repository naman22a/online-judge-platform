import crypto from 'crypto';

export function generateCacheKey(language: string, code: string, problemId: number): string {
    const normalizedCode = code.trim().replace(/\r\n/g, '\n');
    const combined = `${language}:${problemId}:${normalizedCode}`;
    return crypto.createHash('sha256').update(combined).digest('hex');
}
