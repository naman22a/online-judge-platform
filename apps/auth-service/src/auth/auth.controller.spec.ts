import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '@leetcode/database';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { redis } from '../redis';
import { CONFIRMATION_PREFIX, FORGOT_PASSWORD_PREFIX } from '../constants';

// ──────────────────────────────────────────────
// Mocks
// ──────────────────────────────────────────────

jest.mock('argon2');
jest.mock('jsonwebtoken');
jest.mock('../redis', () => ({
    redis: {
        get: jest.fn(),
        del: jest.fn(),
    },
}));
jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mock-uuid-1234'),
}));

const mockPrisma = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
};

const mockMailService = {
    createConfirmationMetadata: jest.fn(),
    sendEmail: jest.fn(),
    createForgotpasswordMetadata: jest.fn(),
};

const mockAuthService = {
    createAccessToken: jest.fn(),
    createRefreshToken: jest.fn(),
};

const mockConfigService = {
    get: jest.fn(),
};

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const mockUser = {
    id: 1,
    username: 'naman',
    email: 'naman@example.com',
    password: 'hashed_password',
    emailVerfied: true,
    tokenVersion: 0,
};

// ──────────────────────────────────────────────
// Test suite
// ──────────────────────────────────────────────

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: PrismaService, useValue: mockPrisma },
                { provide: MailService, useValue: mockMailService },
                { provide: AuthService, useValue: mockAuthService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    // ────────────────────────────────────────────
    // register
    // ────────────────────────────────────────────

    describe('register', () => {
        const dto = { username: 'naman', email: 'naman@example.com', password: 'secret' };

        it('returns error when username is already taken', async () => {
            mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser); // username check

            const result = await controller.register(dto);

            expect(result).toEqual({
                ok: false,
                errors: [{ field: 'username', message: 'username already taken' }],
            });
            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                where: { username: dto.username },
            });
        });

        it('returns error when email is already taken', async () => {
            mockPrisma.user.findUnique
                .mockResolvedValueOnce(null) // username check passes
                .mockResolvedValueOnce(mockUser); // email check fails

            const result = await controller.register(dto);

            expect(result).toEqual({
                ok: false,
                errors: [{ field: 'email', message: 'email already taken' }],
            });
        });

        it('creates user, sends confirmation email, returns ok on success', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);
            (argon2.hash as jest.Mock).mockResolvedValue('hashed_pw');
            mockPrisma.user.create.mockResolvedValue(mockUser);
            mockMailService.createConfirmationMetadata.mockResolvedValue({
                subject: 'Confirm',
                body: '...',
            });

            const result = await controller.register(dto);

            expect(argon2.hash).toHaveBeenCalledWith(dto.password);
            expect(mockPrisma.user.create).toHaveBeenCalledWith({
                data: { username: dto.username, email: dto.email, password: 'hashed_pw' },
            });
            expect(mockMailService.sendEmail).toHaveBeenCalledWith(dto.email, expect.anything());
            expect(result).toEqual({ ok: true });
        });
    });

    // ────────────────────────────────────────────
    // confirmEmail
    // ────────────────────────────────────────────

    describe('confirmEmail', () => {
        it('returns { ok: false } when no token provided', async () => {
            expect(await controller.confirmEmail('')).toEqual({ ok: false });
            expect(await controller.confirmEmail(undefined as any)).toEqual({ ok: false });
        });

        it('returns { ok: false } when token not found in redis', async () => {
            (redis.get as jest.Mock).mockResolvedValue(null);

            expect(await controller.confirmEmail('bad-token')).toEqual({ ok: false });
        });

        it('returns { ok: false } when user not found in db', async () => {
            (redis.get as jest.Mock).mockResolvedValue('42');
            mockPrisma.user.findUnique.mockResolvedValue(null);

            expect(await controller.confirmEmail('tok')).toEqual({ ok: false });
        });

        it('verifies user, deletes token, returns { ok: true }', async () => {
            (redis.get as jest.Mock).mockResolvedValue(String(mockUser.id));
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            mockPrisma.user.update.mockResolvedValue({ ...mockUser, emailVerfied: true });

            const result = await controller.confirmEmail('valid-token');

            expect(mockPrisma.user.update).toHaveBeenCalledWith({
                where: { id: mockUser.id },
                data: { emailVerfied: true },
            });
            expect(redis.del).toHaveBeenCalledWith(CONFIRMATION_PREFIX + 'valid-token');
            expect(result).toEqual({ ok: true });
        });
    });

    // ────────────────────────────────────────────
    // login
    // ────────────────────────────────────────────

    describe('login', () => {
        const dto = { email: 'naman@example.com', password: 'secret' };

        it('returns error when user does not exist', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            const result = await controller.login(dto);

            expect(result).toMatchObject({
                accessToken: '',
                errors: [{ field: 'email' }],
            });
        });

        it('returns error when password is incorrect', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            (argon2.verify as jest.Mock).mockResolvedValue(false);

            const result = await controller.login(dto);

            expect(result).toMatchObject({
                accessToken: '',
                errors: [{ field: 'password' }],
            });
        });

        it('returns error when email is not verified', async () => {
            mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, emailVerfied: false });
            (argon2.verify as jest.Mock).mockResolvedValue(true);

            const result = await controller.login(dto);

            expect(result).toMatchObject({
                accessToken: '',
                errors: [{ field: 'email', message: 'Please verify your email.' }],
            });
        });

        it('returns access and refresh tokens on valid credentials', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            (argon2.verify as jest.Mock).mockResolvedValue(true);
            mockAuthService.createAccessToken.mockReturnValue('access-tok');
            mockAuthService.createRefreshToken.mockReturnValue('refresh-tok');

            const result = await controller.login(dto);

            expect(result).toEqual({ accessToken: 'access-tok', refreshToken: 'refresh-tok' });
        });
    });

    // ────────────────────────────────────────────
    // logout
    // ────────────────────────────────────────────

    describe('logout', () => {
        it('always returns { ok: true }', () => {
            // @InternalAuth guard is bypassed in unit tests — test the handler directly
            const result = controller.logout({ userId: 1, data: {} } as any);
            expect(result).toEqual({ ok: true });
        });
    });

    // ────────────────────────────────────────────
    // refreshToken
    // ────────────────────────────────────────────

    describe('refreshToken', () => {
        beforeEach(() => {
            mockConfigService.get.mockReturnValue('refresh-secret');
        });

        it('returns empty accessToken when no token provided', async () => {
            expect(await controller.refreshToken({ token: '' })).toEqual({ accessToken: '' });
        });

        it('returns empty accessToken when jwt.verify throws', async () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error('invalid');
            });

            expect(await controller.refreshToken({ token: 'bad' })).toEqual({ accessToken: '' });
        });

        it('returns empty accessToken when user not found', async () => {
            (jwt.verify as jest.Mock).mockReturnValue({ userId: 99, tokenVersion: 0 });
            mockPrisma.user.findUnique.mockResolvedValue(null);

            expect(await controller.refreshToken({ token: 'tok' })).toEqual({ accessToken: '' });
        });

        it('returns empty accessToken when tokenVersion mismatch', async () => {
            (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUser.id, tokenVersion: 99 });
            mockPrisma.user.findUnique.mockResolvedValue(mockUser); // tokenVersion: 0

            expect(await controller.refreshToken({ token: 'tok' })).toEqual({ accessToken: '' });
        });

        it('returns new token pair on valid refresh token', async () => {
            (jwt.verify as jest.Mock).mockReturnValue({
                userId: mockUser.id,
                tokenVersion: mockUser.tokenVersion,
            });
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            mockAuthService.createAccessToken.mockReturnValue('new-access');
            mockAuthService.createRefreshToken.mockReturnValue('new-refresh');

            const result = await controller.refreshToken({ token: 'valid-tok' });

            expect(result).toEqual({ accessToken: 'new-access', refreshToken: 'new-refresh' });
        });
    });

    // ────────────────────────────────────────────
    // forgotPassword
    // ────────────────────────────────────────────

    describe('forgotPassword', () => {
        it('returns { ok: true } silently when user does not exist (no enumeration)', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            const result = await controller.forgotPassword({ email: 'ghost@example.com' });

            expect(mockMailService.sendEmail).not.toHaveBeenCalled();
            expect(result).toEqual({ ok: true });
        });

        it('sends reset email and returns { ok: true } when user exists', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            mockMailService.createForgotpasswordMetadata.mockResolvedValue({ subject: 'Reset' });

            const result = await controller.forgotPassword({ email: mockUser.email });

            expect(mockMailService.sendEmail).toHaveBeenCalledWith(
                mockUser.email,
                expect.anything(),
            );
            expect(result).toEqual({ ok: true });
        });
    });

    // ────────────────────────────────────────────
    // resetPassword
    // ────────────────────────────────────────────

    describe('resetPassword', () => {
        it('returns { ok: false } when no token provided', async () => {
            expect(await controller.resetPassword({ token: '', password: 'new' })).toEqual({
                ok: false,
            });
        });

        it('returns { ok: false } when token not in redis', async () => {
            (redis.get as jest.Mock).mockResolvedValue(null);

            expect(await controller.resetPassword({ token: 'bad', password: 'new' })).toEqual({
                ok: false,
            });
        });

        it('returns { ok: false } when user not found', async () => {
            (redis.get as jest.Mock).mockResolvedValue('42');
            mockPrisma.user.findUnique.mockResolvedValue(null);

            expect(await controller.resetPassword({ token: 'tok', password: 'new' })).toEqual({
                ok: false,
            });
        });

        it('hashes password, updates user, increments tokenVersion, deletes token', async () => {
            (redis.get as jest.Mock).mockResolvedValue(String(mockUser.id));
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            (argon2.hash as jest.Mock).mockResolvedValue('new-hashed-pw');
            mockPrisma.user.update.mockResolvedValue(mockUser);

            const result = await controller.resetPassword({
                token: 'reset-tok',
                password: 'newpassword',
            });

            expect(argon2.hash).toHaveBeenCalledWith('newpassword');

            // password update
            expect(mockPrisma.user.update).toHaveBeenCalledWith({
                where: { id: mockUser.id },
                data: { password: 'new-hashed-pw' },
            });

            // tokenVersion increment
            expect(mockPrisma.user.update).toHaveBeenCalledWith({
                where: { id: mockUser.id },
                data: { tokenVersion: { increment: 1 } },
            });

            expect(redis.del).toHaveBeenCalledWith(FORGOT_PASSWORD_PREFIX + 'reset-tok');
            expect(result).toEqual({ ok: true });
        });
    });
});
