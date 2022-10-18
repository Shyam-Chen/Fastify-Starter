import plugin from 'fastify-plugin';
import sensible from '@fastify/sensible';

export default plugin(
  async (app, opts) => {
    app.register(sensible).after(() => {
      app.setNotFoundHandler((req, reply) => {
        reply.notFound();
      });
    });
  },
  { name: 'error' },
);
