/// <reference types="vite-plugin-fastify-routes/client" />

declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';

    HOST: string;
    PORT: number;
  }
}
