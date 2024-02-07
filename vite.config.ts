import { resolve } from 'path';
import { defineConfig } from 'vite';
import fastify from 'vite-plugin-fastify';
import fastifyRoutes from 'vite-plugin-fastify-routes';
import envify from 'process-envify';

export default defineConfig({
  define: envify({
    NODE_ENV: process.env.NODE_ENV || 'development',

    HOST: process.env.HOST || '127.0.0.1',
    PORT: process.env.PORT || 3000,

    SITE_URL: process.env.SITE_URL || 'http://127.0.0.1:5173',

    MONGODB_URL:
      process.env.MONGODB_URL ||
      'mongodb+srv://fastify:starter@cluster0.tes26sm.mongodb.net/mydb?retryWrites=true&w=majority',
    REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    CLOUDINARY_URL:
      process.env.CLOUDINARY_URL ||
      'cloudinary://636761771455612:nBBydtdox8huZPXHHsxgKFDkiUU@dfi8gex0k',
    SMTP_URL:
      process.env.SMTP_URL ||
      'smtp://ford.weimann@ethereal.email:HSqNjfZfrKh7KjcUSU@smtp.ethereal.email:587?name=example.com',

    SECRET_KEY: process.env.SECRET_KEY || 'jbmpHPLoaV8N0nEpuLxlpT95FYakMPiu',
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
      '~': resolve(__dirname, 'src'),
    },
  },
  build: {
    ssrEmitAssets: true,
  },
  test: {
    globals: true,
  },
});
