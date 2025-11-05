export default () => ({
    node_env: process.env.NODE_ENV,
    database_url: process.env.DATABASE_URL,
    cors_origin: process.env.CORS_ORIGIN,
});
