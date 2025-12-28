import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import mongodb from '@fastify/mongodb';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import redis from '@fastify/redis';
import sensible from '@fastify/sensible';
// import sse from '@fastify/sse';
import underPressure from '@fastify/under-pressure';
import fastify from 'fastify';
import cloudinary from 'fastify-cloudinary';
import { eventsource, serverFactory, websocket } from 'fastify-uws';

import i18n from '~/plugins/i18n.ts';
import router from '~/plugins/router.ts';
import redisInstance from '~/utilities/redisInstance.ts';

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
  app.register(sensible);
  // app.register(sse);
  app.register(underPressure, { exposeStatusRoute: '/api/healthz' });
  app.register(cloudinary, { url: process.env.CLOUDINARY_URL });
  app.register(eventsource);
  app.register(websocket);

  app.register(i18n);
  app.register(router);

  return app;
};
