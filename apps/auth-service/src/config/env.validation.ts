import { plainToInstance } from 'class-transformer';
import { IsEnum, validateSync, IsNotEmpty } from 'class-validator';

enum Environment {
    Development = 'development',
    Production = 'production',
    Testing = 'testing',
    Provision = 'provision',
}

export class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsNotEmpty()
    DATABASE_URL: string;

    @IsNotEmpty()
    CORS_ORIGIN: string;
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
