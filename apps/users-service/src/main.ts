import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@leetcode/config';
import { register } from 'prom-client';
import { startMetricsServer } from './metrics-server';

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const configService = appContext.get(ConfigService<Configuration>);

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.TCP,
        options: {
            host: '0.0.0.0',
            port: configService.get('users_service_port'),
        },
    });
    startMetricsServer(register, configService.get('users_service_port')!);
    await app.listen();
}
bootstrap();
