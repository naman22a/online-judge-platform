import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, Matches, Max, Min, validateSync } from 'class-validator';

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
    Provision = 'provision',
}

export class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsNumber()
    @Min(0)
    @Max(65536)
    API_GATEWAY_PORT: number;

    @IsNumber()
    @Min(0)
    @Max(65536)
    USERS_SERVICE_PORT: number;

    @IsNumber()
    @Min(0)
    @Max(65536)
    AUTH_SERVICE_PORT: number;

    @IsNumber()
    @Min(0)
    @Max(65536)
    PROBLEMS_SERVICE_PORT: number;

    @IsNotEmpty()
    CLIENT_URL: string;

    @IsNotEmpty()
    SERVER_URL: string;

    @Matches(/^postgresql:\/\/([^:]+):([^@]+)@([^:\/]+):(\d+)\/([^?]+)\?schema=([^&]+)$/)
    DATABASE_URL: string;

    @IsNotEmpty()
    REDIS_HOST: string;

    @IsNumber()
    @Min(0)
    @Max(65536)
    REDIS_PORT: number;

    @IsNotEmpty()
    ACCESS_TOKEN_SECRET: string;

    @IsNotEmpty()
    REFRESH_TOKEN_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
