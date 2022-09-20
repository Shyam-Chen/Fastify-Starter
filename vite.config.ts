import path from 'path';
import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import envify from 'process-envify';

import env from './env';

export default defineConfig({
  define: envify(env),
  server: {
    port: 3000,
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'fastify',
      appPath: './src/app.ts',
    }),
    viteStaticCopy({
      targets: [{ src: 'src/server.js', dest: '' }],
    }),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  test: {},
});
