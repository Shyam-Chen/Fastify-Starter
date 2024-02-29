/// <reference types="vite-plugin-fastify-routes/client" />

declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';

    HOST: string;
    PORT: number;

    SITE_URL: string;

    MONGODB_URL: string;
    REDIS_URL: string;
    CLOUDINARY_URL: string;
    SMTP_URL: string;

    SECRET_KEY: string;
  }
}
