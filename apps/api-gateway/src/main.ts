import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { exceptionFactory } from './validation';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@leetcode/config';

declare global {
    namespace Express {
        export interface Request {
            userId?: number;
        }
    }
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CONFIGURATION
    const configService = app.get(ConfigService<Configuration>);
    const port = configService.get('api_gateway_port');
    const client_url = configService.get('client_url');

    // VALIDATION
    app.useGlobalPipes(new ValidationPipe({ exceptionFactory }));

    // MIDDLWARE
    app.use(cookieParser());
    app.enableCors({
        origin: [client_url],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });

    app.setGlobalPrefix('api');

    // SWAGGER
    const config = new DocumentBuilder().setTitle('Leetcode API').setVersion('1.0').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // STARTING THE SERVER
    await app.listen(port);
}
bootstrap();
