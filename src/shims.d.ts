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

declare module 'bcrypt' {
  export function hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>;
  export function compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
