import type { FastifyInstance } from 'fastify';

// mock api for https://vue-starter-6fa6.onrender.com
export default async (app: FastifyInstance) => {
  app.post('/sign-in', async (req, reply) => {
    return { token: 'xxx' };
  });

  app.get('/suggestions', async (req, reply) => {
    const opts = [
      { label: 'Angular', value: 'f1' },
      { label: 'React', value: 'f2' },
      { label: 'Svelte', value: 'f3' },
      { label: 'Vue', value: 'f4' },
      { label: 'Express', value: 'b1' },
      { label: 'Fastify', value: 'b2' },
      { label: 'Koa', value: 'b3' },
      { label: 'Nest', value: 'b4' },
      { label: 'Capacitor', value: 'm1' },
      { label: 'Cordova', value: 'm2' },
      { label: 'Ionic', value: 'm3' },
      { label: 'NativeScript', value: 'm4' },
      { label: 'Electron', value: 'd1' },
      { label: 'NW', value: 'd2' },
      { label: 'Neutralino', value: 'd3' },
      { label: 'Tauri', value: 'd4' },

      { label: 'Vuetify', value: 'vuetify' },
      { label: 'Nuxt', value: 'nuxt' },
      { label: 'Pinia', value: 'pinia' },
      { label: 'Vue Router', value: 'vueRouter' },
      { label: 'Vite', value: 'vite' },
      { label: 'Vitest', value: 'vitest' },
      { label: 'Playwright', value: 'playwright' },
      { label: 'TypeScript', value: 'ts' },
      { label: 'JaveScript', value: 'js' },
      { label: 'CoffeeScript', value: 'coffee' },
    ];

    if (req.query?.value) {
      const { value } = req.query;

      return [...opts].filter(
        (item) =>
          item.label.toUpperCase().includes(value.toUpperCase()) ||
          item.value.toUpperCase().includes(value.toUpperCase()),
      );
    }

    return [];
  });
};
