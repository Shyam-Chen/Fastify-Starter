import fastify from 'fastify';

const app = async (options = {}) => {
  const app = fastify(options);

  app.get('/', (req, reply) => {
    reply.send('change me to see updates, fastify!');
  });

  return app;
};

export const viteNodeApp = app();

export default app;
