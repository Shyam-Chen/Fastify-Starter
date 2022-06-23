import fastify from 'fastify';
// import mongodb from '@fastify/mongodb';

const app = async (options = {}) => {
  const app = fastify(options);

  // app.register(mongodb, { url: 'mongodb://mongo/mydb' });

  app.get('/', (req, reply) => {
    reply.send('change me to see updates, fastify!');
  });

  app.get('/hello-world', async (req, reply) => {
    reply.type('application/json').code(200);
    return { hello: 'world' };
  });

  return app;
};

export const viteNodeApp = app({ logger: true });

export default app;
