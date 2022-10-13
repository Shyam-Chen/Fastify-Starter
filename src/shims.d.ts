declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    MONGODB_URL: string;
    SECRET_KEY: string;
  }
}

declare module 'fastify-sse-v2' {
  export const FastifySSEPlugin: any;
}
