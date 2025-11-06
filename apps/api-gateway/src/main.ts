import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { exceptionFactory } from './validation';
import cookieParser from 'cookie-parser';

declare global {
    namespace Express {
        export interface Request {
            userId?: number;
        }
    }
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // VALIDATION
    app.useGlobalPipes(new ValidationPipe({ exceptionFactory }));

    // MIDDLWARE
    app.use(cookieParser());
    app.enableCors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    });

    app.setGlobalPrefix('api');
    await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
