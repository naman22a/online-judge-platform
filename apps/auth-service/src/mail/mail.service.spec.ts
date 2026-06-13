/* eslint-disable */

// ── All jest.mock calls must be at the very top, fully self-contained ──────────

jest.mock('uuid', () => ({ v4: jest.fn(() => 'mock-uuid-1234') }));

jest.mock('../redis', () => ({
    redis: {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    },
}));

// Factory is fully self-contained — no references to outer scope variables.
// This is the only way to avoid "Cannot set property … only a getter".
jest.mock('nodemailer', () => {
    const sendMail = jest.fn().mockResolvedValue({ messageId: 'mock-message-id' });
    const createTransport = jest.fn().mockReturnValue({ sendMail });
    const createTestAccount = jest.fn().mockResolvedValue({
        user: 'test@ethereal.email',
        pass: 'testpass',
    });
    const getTestMessageUrl = jest.fn().mockReturnValue('https://ethereal.email/preview/mock');

    return { createTestAccount, createTransport, getTestMessageUrl, __sendMail: sendMail };
});

// ── Imports (after mocks) ──────────────────────────────────────────────────────

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { v4 } from 'uuid';
import { MailService } from './mail.service';
import { redis } from '../redis';
import { CONFIRMATION_PREFIX, FORGOT_PASSWORD_PREFIX } from '../constants';

// ── Typed handles into the mocked module ──────────────────────────────────────

const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer> & { __sendMail: jest.Mock };

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('MailService', () => {
    let service: MailService;
    const CLIENT_URL = 'http://localhost:3000';

    const mockConfigService = {
        get: jest.fn().mockReturnValue(CLIENT_URL),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        // Restore defaults cleared by clearAllMocks
        mockedNodemailer.createTestAccount.mockResolvedValue({
            user: 'test@ethereal.email',
            pass: 'testpass',
        } as any);
        mockedNodemailer.__sendMail.mockResolvedValue({ messageId: 'mock-message-id' });
        mockedNodemailer.createTransport.mockReturnValue({
            sendMail: mockedNodemailer.__sendMail,
        } as any);
        mockedNodemailer.getTestMessageUrl.mockReturnValue(
            'https://ethereal.email/preview/mock' as any,
        );
        mockConfigService.get.mockReturnValue(CLIENT_URL);

        const module: TestingModule = await Test.createTestingModule({
            providers: [MailService, { provide: ConfigService, useValue: mockConfigService }],
        }).compile();

        service = module.get<MailService>(MailService);
    });

    // ── sendEmail ──────────────────────────────────────────────────────────────

    describe('sendEmail', () => {
        const metadata = {
            url: 'http://localhost:3000/confirm/abc',
            subject: 'Confirmation Email',
        };

        it('creates a nodemailer test account', async () => {
            await service.sendEmail('user@example.com', metadata);
            expect(mockedNodemailer.createTestAccount).toHaveBeenCalledTimes(1);
        });

        it('creates a transporter with ethereal smtp config', async () => {
            await service.sendEmail('user@example.com', metadata);

            expect(mockedNodemailer.createTransport).toHaveBeenCalledWith({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: { user: 'test@ethereal.email', pass: 'testpass' },
            });
        });

        it('sends mail to the correct recipient with correct subject and html', async () => {
            await service.sendEmail('user@example.com', metadata);

            expect(mockedNodemailer.__sendMail).toHaveBeenCalledWith({
                from: '"Online Judge Platform" <oj@oj.com>',
                to: 'user@example.com',
                subject: metadata.subject,
                html: `<a href="${metadata.url}">${metadata.url}</a>`,
            });
        });

        it('calls getTestMessageUrl with the send result', async () => {
            await service.sendEmail('user@example.com', metadata);
            expect(mockedNodemailer.getTestMessageUrl).toHaveBeenCalledWith({
                messageId: 'mock-message-id',
            });
        });

        it('propagates errors thrown by sendMail', async () => {
            mockedNodemailer.__sendMail.mockRejectedValueOnce(new Error('SMTP error'));
            await expect(service.sendEmail('user@example.com', metadata)).rejects.toThrow(
                'SMTP error',
            );
        });
    });

    // ── createConfirmationMetadata ─────────────────────────────────────────────

    describe('createConfirmationMetadata', () => {
        it('stores userId in redis with the confirmation prefix and 3-day TTL', async () => {
            await service.createConfirmationMetadata(1);

            expect(redis.set).toHaveBeenCalledWith(
                CONFIRMATION_PREFIX + 'mock-uuid-1234',
                1,
                'EX',
                3600 * 24 * 3,
            );
        });

        it('returns correct url using CLIENT_URL and the generated token', async () => {
            const result = await service.createConfirmationMetadata(1);
            expect(result.url).toBe(`${CLIENT_URL}/confirm/mock-uuid-1234`);
        });

        it('returns "Confirmation Email" as the subject', async () => {
            const result = await service.createConfirmationMetadata(1);
            expect(result.subject).toBe('Confirmation Email');
        });

        it('uses a fresh token per call', async () => {
            (v4 as jest.Mock).mockReturnValueOnce('token-aaa').mockReturnValueOnce('token-bbb');

            const first = await service.createConfirmationMetadata(1);
            const second = await service.createConfirmationMetadata(2);

            expect(first.url).toContain('token-aaa');
            expect(second.url).toContain('token-bbb');
        });

        it('reads CLIENT_URL from ConfigService', async () => {
            mockConfigService.get.mockReturnValueOnce('https://prod.example.com');
            const result = await service.createConfirmationMetadata(5);

            expect(mockConfigService.get).toHaveBeenCalledWith('CLIENT_URL');
            expect(result.url).toContain('https://prod.example.com');
        });
    });

    // ── createForgotpasswordMetadata ───────────────────────────────────────────

    describe('createForgotpasswordMetadata', () => {
        it('stores userId in redis with the forgot-password prefix and 5-hour TTL', async () => {
            await service.createForgotpasswordMetadata(7);

            expect(redis.set).toHaveBeenCalledWith(
                FORGOT_PASSWORD_PREFIX + 'mock-uuid-1234',
                7,
                'EX',
                3600 * 5,
            );
        });

        it('returns correct url using CLIENT_URL and the generated token', async () => {
            const result = await service.createForgotpasswordMetadata(7);
            expect(result.url).toBe(`${CLIENT_URL}/reset-password/mock-uuid-1234`);
        });

        it('returns "Reset Password" as the subject', async () => {
            const result = await service.createForgotpasswordMetadata(7);
            expect(result.subject).toBe('Reset Password');
        });

        it('uses a fresh token per call', async () => {
            (v4 as jest.Mock).mockReturnValueOnce('reset-aaa').mockReturnValueOnce('reset-bbb');

            const first = await service.createForgotpasswordMetadata(1);
            const second = await service.createForgotpasswordMetadata(2);

            expect(first.url).toContain('reset-aaa');
            expect(second.url).toContain('reset-bbb');
        });

        it('reads CLIENT_URL from ConfigService', async () => {
            mockConfigService.get.mockReturnValueOnce('https://prod.example.com');
            const result = await service.createForgotpasswordMetadata(3);

            expect(mockConfigService.get).toHaveBeenCalledWith('CLIENT_URL');
            expect(result.url).toContain('https://prod.example.com');
        });
    });

    // ── Redis key isolation ────────────────────────────────────────────────────

    describe('redis key isolation', () => {
        it('confirmation and reset calls write to different prefixed redis keys', async () => {
            (v4 as jest.Mock).mockReturnValue('same-token');

            await service.createConfirmationMetadata(1);
            await service.createForgotpasswordMetadata(1);

            const calls = (redis.set as jest.Mock).mock.calls;
            const confirmKey: string = calls[0][0];
            const resetKey: string = calls[1][0];

            expect(confirmKey).not.toBe(resetKey);
            expect(confirmKey).toContain(CONFIRMATION_PREFIX);
            expect(resetKey).toContain(FORGOT_PASSWORD_PREFIX);
        });
    });
});
