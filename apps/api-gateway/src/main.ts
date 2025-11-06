import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { exceptionFactory } from './validation';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

    // SWAGGER
    const config = new DocumentBuilder().setTitle('Leetcode API').setVersion('1.0').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
