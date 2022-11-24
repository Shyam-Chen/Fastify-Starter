import type { FastifyServerOptions } from 'fastify';
import fastify from 'fastify';
import cors from '@fastify/cors';
import mongodb from '@fastify/mongodb';
import redis from '@fastify/redis';
import multipart from '@fastify/multipart';
import cloudinary from 'fastify-cloudinary';
import jwt from '@fastify/jwt';

import router from '~/plugins/router';
import websocket from '~/plugins/websocket';
import eventsource from '~/plugins/eventsource';
import i18n from '~/plugins/i18n';
import redisInstance from '~/utilities/redisInstance';

const app = async (options: FastifyServerOptions = {}) => {
  const app = fastify(options);
  app.register(import('./error'));

  app.register(cors, { origin: new RegExp(process.env.SITE_URL, 'gi') });
  app.register(mongodb, { url: process.env.MONGODB_URL });
  app.register(redis, { client: redisInstance });
  app.register(multipart);
  app.register(cloudinary, { url: process.env.CLOUDINARY_URL });
  app.register(jwt, { secret: process.env.SECRET_KEY });

  app.register(router, { prefix: '/api' });
  app.register(websocket, { prefix: '/api' });
  app.register(eventsource, { prefix: '/api' });
  app.register(i18n);

  app.get('/api/healthz', async () => 'healthz');

  return app;
};

export default app;
