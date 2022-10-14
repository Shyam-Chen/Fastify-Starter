declare namespace NodeJS {
  export interface ProcessEnv {
    APP_NAME: string;
    NODE_ENV: string;

    PORT: number;

    SITE_URL: string;

    MONGODB_URL: string;

    SECRET_KEY: string;
  }
}

declare module 'fastify-sse-v2' {
  export const FastifySSEPlugin: any;
}
