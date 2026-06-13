import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('AuthService', () => {
    let authService: AuthService;
    let configService: jest.Mocked<ConfigService>;

    const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        emailVerfied: true,
        tokenVersion: 0,
        full_name: 'Test User',
        avatar_url: null,
        bio: null,
        github_url: null,
        linkedin_url: null,
        website_url: null,
        is_admin: false,
        created_at: new Date(),
        updated_at: new Date(),
    };

    beforeEach(async () => {
        configService = {
            get: jest.fn(),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: ConfigService,
                    useValue: configService,
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('createAccessToken', () => {
        it('should create a valid access token', async () => {
            // Mock the secret and sign function
            const mockSecret = 'test-access-secret';
            configService.get.mockReturnValue(mockSecret);

            (sign as jest.Mock).mockReturnValue('mock-access-token');

            const result = authService.createAccessToken(mockUser);

            expect(result).toBe('mock-access-token');
            expect(configService.get).toHaveBeenCalledWith('ACCESS_TOKEN_SECRET');
            expect(sign).toHaveBeenCalledWith({ userId: mockUser.id }, mockSecret, {
                expiresIn: '15m',
            });
        });
    });

    describe('createRefreshToken', () => {
        it('should create a valid refresh token', async () => {
            // Mock the secret and sign function
            const mockSecret = 'test-refresh-secret';
            configService.get.mockReturnValue(mockSecret);

            (sign as jest.Mock).mockReturnValue('mock-refresh-token');

            const result = authService.createRefreshToken(mockUser);

            expect(result).toBe('mock-refresh-token');
            expect(configService.get).toHaveBeenCalledWith('REFRESH_TOKEN_SECRET');
            expect(sign).toHaveBeenCalledWith(
                {
                    userId: mockUser.id,
                    tokenVersion: mockUser.tokenVersion,
                },
                mockSecret,
                { expiresIn: '7d' },
            );
        });
    });
});
