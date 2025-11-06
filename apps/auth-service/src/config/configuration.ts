export default () => ({
    node_env: process.env.NODE_ENV,
    database_url: process.env.DATABASE_URL,
    cors_origin: process.env.CORS_ORIGIN,
    redis_host: process.env.REDIS_HOST,
    redis_port: parseInt(process.env.REDIS_PORT!, 10),
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
});
