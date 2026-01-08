import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { exceptionFactory } from './validation';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@leetcode/config';
import { IoAdapter } from '@nestjs/platform-socket.io';

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
        origin: (origin: string, callback: Function) => {
            const allowedOrigins = ['https://judge.namanarora.xyz', 'http://localhost:3000'];

            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        exposedHeaders: ['Set-Cookie'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    app.useWebSocketAdapter(new IoAdapter(app));

    app.setGlobalPrefix('api', {
        exclude: [{ path: 'metrics', method: RequestMethod.GET }],
    });

    // SWAGGER
    const config = new DocumentBuilder().setTitle('Leetcode API').setVersion('1.0').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // STARTING THE SERVER
    await app.listen(port, '0.0.0.0');
}
bootstrap();
