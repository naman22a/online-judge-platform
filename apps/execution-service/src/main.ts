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
            port: configService.get('execution_service_port'),
        },
    });
    startMetricsServer(
        register,
        Number(String(configService.get('execution_service_port')!).replace('500', '900')),
    );
    await app.listen();
}
bootstrap();
