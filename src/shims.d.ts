declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;

    HOST: string;
    PORT: number;

    SITE_URL: string;

    MONGODB_URL: string;
    REDIS_URL: string;
    CLOUDINARY_URL: string;

    SECRET_KEY: string;
  }
}

declare module 'fastify-sse-v2' {
  export const FastifySSEPlugin: any;
}
