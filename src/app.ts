import type { FastifyServerOptions } from 'fastify';
import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import mongodb from '@fastify/mongodb';
import multipart from '@fastify/multipart';
import redis from '@fastify/redis';
import websocket from '@fastify/websocket';
import underPressure from '@fastify/under-pressure';
import cloudinary from 'fastify-cloudinary';
import { FastifySSEPlugin as eventsource } from 'fastify-sse-v2';

import router from '~/plugins/router';
import i18n from '~/plugins/i18n';
import redisInstance from '~/utilities/redisInstance';

const app = async (options: FastifyServerOptions = {}) => {
  const app = fastify(options);
  app.register(import('./error'));

  app.register(cors, { origin: new RegExp(process.env.SITE_URL, 'gi') });
  app.register(helmet);
  app.register(rateLimit, { max: 100 });
  app.register(jwt, { secret: process.env.SECRET_KEY });
  app.register(mongodb, { url: process.env.MONGODB_URL });
  app.register(multipart);
  app.register(redis, { client: redisInstance });
  app.register(websocket);
  app.register(underPressure, { exposeStatusRoute: '/api/healthz' });
  app.register(cloudinary, { url: process.env.CLOUDINARY_URL });
  app.register(eventsource);

  app.register(router);
  app.register(i18n);

  return app;
};

export default app;
