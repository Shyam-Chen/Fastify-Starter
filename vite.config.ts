import { resolve } from 'path';
import { defineConfig } from 'vite';
import fastify from 'vite-plugin-fastify';
import fastifyRoutes from 'vite-plugin-fastify-routes';
import envify from 'process-envify';

import env from './env';

export default defineConfig({
  define: envify(env),
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
    rollupOptions: {
      input: {
        index: './index.ts',
      },
    },
  },
});
