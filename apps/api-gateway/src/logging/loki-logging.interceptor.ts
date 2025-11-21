import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LokiLogger } from './loki-logger.service';

@Injectable()
export class LokiLoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LokiLogger) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, url, body } = req;
        const start = Date.now();

        return next.handle().pipe(
            tap({
                next: (res) => {
                    const ms = Date.now() - start;
                    this.logger.log(`${method} ${url} ${res?.statusCode || 200} - ${ms}ms`, 'HTTP');
                },
                error: (err) => {
                    const ms = Date.now() - start;
                    this.logger.error(
                        `${method} ${url} - ${err.message} - ${ms}ms`,
                        err.stack,
                        'HTTP',
                    );
                },
            }),
        );
    }
}
