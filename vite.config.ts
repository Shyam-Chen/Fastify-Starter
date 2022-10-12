import path from 'path';
import { defineConfig } from 'vite';
import envify from 'process-envify';

import env from './env';

export default defineConfig({
  define: envify(env),
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    ssr: './src/server.ts',
  },
});
