import { resolve } from 'node:path';
import nodemailer from 'nodemailer';
import envify from 'process-envify';
import { defineConfig, normalizePath } from 'vite';
import fastify from 'vite-plugin-fastify';
import fastifyRoutes from 'vite-plugin-fastify-routes';
import { viteStaticCopy as staticCopy } from 'vite-plugin-static-copy';

const { user, pass } = await nodemailer.createTestAccount();

export default defineConfig({
  define: envify({
    NODE_ENV: process.env.NODE_ENV || 'development',

    HOST: process.env.HOST || '127.0.0.1',
    PORT: process.env.PORT || 3000,

    SITE_URL: process.env.SITE_URL || 'http://127.0.0.1:5173',

    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://root:rootpasswd@127.0.0.1:27017/mydb',
    REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    CLOUDINARY_URL: process.env.CLOUDINARY_URL || 'cloudinary://apikey:apisecret@cloudname',
    SMTP_URL: process.env.SMTP_URL || `smtp://${user}:${pass}@smtp.ethereal.email:587`,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,

    SECRET_KEY: process.env.SECRET_KEY || 'jbmpHPLoaV8N0nEpuLxlpT95FYakMPiu',

    MONGOMS_VERSION: process.env.MONGOMS_VERSION || '7.0.11',
  }),
  plugins: [
    fastify({
      serverPath: './src/main.ts',
      devMode: false,
    }),
    fastifyRoutes(),
    staticCopy({
      targets: [
        {
          src: normalizePath(resolve(import.meta.dirname, './src/jobs/**/*.js')),
          dest: 'jobs',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '~': resolve(import.meta.dirname, 'src'),
    },
  },
  build: {
    ssrEmitAssets: true,
    rollupOptions: {
      input: {
        worker: './src/worker.ts',
      },
    },
  },
  test: {
    globals: true,
  },
});
