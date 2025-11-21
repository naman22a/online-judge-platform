import { Injectable, LoggerService } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LokiLogger implements LoggerService {
    private lokiUrl = process.env.LOKI_URL ?? 'http://loki:3100/loki/api/v1/push';
    private appName = process.env.APP_NAME ?? 'api-gateway';

    log(message: string, context?: string) {
        this.sendLog('info', message, context);
        console.log(`[INFO]${context ? ` [${context}]` : ''} ${message}`);
    }

    error(message: string, trace?: string, context?: string) {
        this.sendLog('error', `${message} ${trace || ''}`, context);
        console.error(`[ERROR]${context ? ` [${context}]` : ''} ${message}`, trace);
    }

    warn(message: string, context?: string) {
        this.sendLog('warn', message, context);
        console.warn(`[WARN]${context ? ` [${context}]` : ''} ${message}`);
    }

    debug(message: string, context?: string) {
        this.sendLog('debug', message, context);
        console.debug(`[DEBUG]${context ? ` [${context}]` : ''} ${message}`);
    }

    private async sendLog(level: string, msg: string, context?: string) {
        try {
            await axios.post(this.lokiUrl, {
                streams: [
                    {
                        stream: { level, app: this.appName, context: context || 'default' },
                        values: [[`${Date.now() * 1_000_000}`, msg]], // nanoseconds
                    },
                ],
            });
        } catch (err) {
            console.error('Failed to send log to Loki', err);
        }
    }
}
