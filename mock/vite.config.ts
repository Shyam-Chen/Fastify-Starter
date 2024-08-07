import { resolve } from 'node:path';
import envify from 'process-envify';
import { defineConfig } from 'vite';
import fastify from 'vite-plugin-fastify';
import fastifyRoutes from 'vite-plugin-fastify-routes';

export default defineConfig({
  define: envify({
    HOST: process.env.HOST || '127.0.0.1',
    PORT: process.env.PORT || 4173,
  }),
  plugins: [fastify(), fastifyRoutes()],
  resolve: {
    alias: {
      '~': resolve(import.meta.dirname, 'src'),
    },
  },
});
