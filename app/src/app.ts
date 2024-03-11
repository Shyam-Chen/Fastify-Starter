import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import mongodb from '@fastify/mongodb';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import redis from '@fastify/redis';
import underPressure from '@fastify/under-pressure';
// import websocket from '@fastify/websocket';
import fastify from 'fastify';
import cloudinary from 'fastify-cloudinary';
import { FastifySSEPlugin as eventsource } from 'fastify-sse-v2';
import { serverFactory, websocket } from 'fastify-uws';

import error from '~/plugins/error';
import i18n from '~/plugins/i18n';
import router from '~/plugins/router';
import redisInstance from '~/utilities/redisInstance';

export default () => {
  const app = fastify({
    logger: {
      transport: {
        target: '@fastify/one-line-logger',
      },
    },
    serverFactory,
  });

  app.register(cors, { origin: new RegExp(process.env.SITE_URL, 'gi') });
  app.register(helmet);
  app.register(jwt, { secret: process.env.SECRET_KEY });
  app.register(mongodb, { url: process.env.MONGODB_URL });
  app.register(multipart);
  app.register(rateLimit, { max: 100 });
  app.register(redis, { client: redisInstance });
  app.register(underPressure, { exposeStatusRoute: '/api/healthz' });
  app.register(websocket);
  app.register(cloudinary, { url: process.env.CLOUDINARY_URL });
  app.register(eventsource);

  app.register(error);
  app.register(i18n);
  app.register(router);

  return app;
};
