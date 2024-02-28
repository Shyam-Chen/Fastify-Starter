import sensible from '@fastify/sensible';
import plugin from 'fastify-plugin';

export default plugin(
  async (app) => {
    app.register(sensible).after(() => {
      app.setNotFoundHandler((req, reply) => {
        reply.notFound();
      });
    });
  },
  { name: 'error' },
);
