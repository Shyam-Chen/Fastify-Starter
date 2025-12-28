import fastify from 'fastify';

import router from '~/plugins/router.ts';

export default () => {
  const app = fastify({
    logger: {
      transport: {
        target: '@fastify/one-line-logger',
      },
    },
  });

  app.register(router);

  return app;
};
