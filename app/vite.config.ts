import { resolve } from 'node:path';
import envify from 'process-envify';
import { defineConfig } from 'vite';
import fastify from 'vite-plugin-fastify';
import fastifyRoutes from 'vite-plugin-fastify-routes';

export default defineConfig({
  define: envify({
    NODE_ENV: process.env.NODE_ENV || 'development',

    HOST: process.env.HOST || '127.0.0.1',
    PORT: process.env.PORT || 3000,

    SITE_URL: process.env.SITE_URL || 'http://127.0.0.1:5173',

    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://root:rootpasswd@127.0.0.1:27017/mydb',
    REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    CLOUDINARY_URL: process.env.CLOUDINARY_URL || 'cloudinary://apikey:apisecret@cloudname',
    SMTP_URL: process.env.SMTP_URL || 'smtp://user:pass@smtp.ethereal.email:587',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,

    SECRET_KEY: process.env.SECRET_KEY || 'jbmpHPLoaV8N0nEpuLxlpT95FYakMPiu',

    /** @deprecated */
    // for testing
    MONGOMS_VERSION: process.env.MONGOMS_VERSION || '8.0.13',
    REDISMS_VERSION: process.env.REDISMS_VERSION || '8.2.1',
  }),
  plugins: [
    fastify({
      serverPath: './src/main.ts',
      devMode: false,
    }),
    fastifyRoutes(),
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
