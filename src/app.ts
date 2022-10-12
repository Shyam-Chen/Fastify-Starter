import type { FastifyServerOptions } from 'fastify';
import fastify from 'fastify';
import mongodb from '@fastify/mongodb';

import router from '~/plugins/router';
import websocket from '~/plugins/websocket';
import eventsource from '~/plugins/eventsource';

const app = async (options: FastifyServerOptions = {}) => {
  const app = fastify(options);

  app.register(mongodb, { url: process.env.MONGODB_URL, forceClose: true });

  app.register(router, { prefix: '/api' });
  app.register(websocket, { prefix: '/api' });
  app.register(eventsource, { prefix: '/api' });

  return app;
};

export default app;
