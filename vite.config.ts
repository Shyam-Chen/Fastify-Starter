import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
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
});
