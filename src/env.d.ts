declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    DB_USER: string;
    DB_PASSWORD: string;
    REDIS_URL: string;
    PORT: string;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
  }
}
