import fastify from 'fastify';
// import mongodb from '@fastify/mongodb';

import helloWorld from './hello-world/routes';

const app = async (options = {}) => {
  const app = fastify(options);

  // app.register(mongodb, { url: 'mongodb://mongo/mydb' });

  app.get('/', (req, reply) => {
    reply.send('change me to see updates, fastify!');
  });

  app.register(helloWorld);

  return app;
};

export const viteNodeApp = app({ logger: true });

export default app;
