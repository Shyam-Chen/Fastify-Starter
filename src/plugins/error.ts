import plugin from 'fastify-plugin';
import sensible from '@fastify/sensible';

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
