import { ConfigType } from '@nestjs/config';

const configuration = () => ({
    enviroment: process.env.NODE_ENV,
    api_gateway_port: parseInt(process.env.API_GATEWAY_PORT!, 10),
    users_service_host: process.env.USERS_SERVICE_HOST ?? 'localhost',
    users_service_port: parseInt(process.env.USERS_SERVICE_PORT!, 10),
    auth_service_host: process.env.AUTH_SERVICE_HOST ?? 'localhost',
    auth_service_port: parseInt(process.env.AUTH_SERVICE_PORT!, 10),
    problems_service_host: process.env.PROBLEMS_SERVICE_HOST ?? 'localhost',
    problems_service_port: parseInt(process.env.PROBLEMS_SERVICE_PORT!, 10),
    tags_service_host: process.env.TAGS_SERVICE_HOST ?? 'localhost',
    tags_service_port: parseInt(process.env.TAGS_SERVICE_PORT!, 10),
    companies_service_host: process.env.COMPANIES_SERVICE_HOST ?? 'localhost',
    companies_service_port: parseInt(process.env.COMPANIES_SERVICE_PORT!, 10),
    submissions_service_host: process.env.SUBMISSIONS_SERVICE_HOST ?? 'localhost',
    submissions_service_port: parseInt(process.env.SUBMISSIONS_SERVICE_PORT!, 10),
    execution_service_host: process.env.EXECUTION_SERVICE_HOST ?? 'localhost',
    execution_service_port: parseInt(process.env.EXECUTION_SERVICE_PORT!, 10),
    client_url: process.env.CLIENT_URL,
    server_url: process.env.SERVER_URL,
    db_url: process.env.DATABASE_URL,
    redis_host: process.env.REDIS_HOST,
    redis_port: parseInt(process.env.REDIS_PORT!, 10),
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
});

export type Configuration = ConfigType<typeof configuration>;
export default configuration;
