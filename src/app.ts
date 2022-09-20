import fastify from 'fastify';
// import mongodb from '@fastify/mongodb';

import helloWorld from '~/hello-world/routes';

const app = async (options = {}) => {
  const app = fastify(options);

  // app.register(mongodb, { url: 'mongodb://mongo/mydb' });

  app.get('/', (req, reply) => {
    console.log('process.env.NODE_ENV =', process.env.NODE_ENV);
    console.log('process.env.SECRET =', process.env.SECRET);

    reply.send('change me to see updates, fastify!');
  });

  app.register(helloWorld);

  return app;
};

export default app;
