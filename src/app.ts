import type { FastifyServerOptions } from 'fastify';
import fastify from 'fastify';
import cors from '@fastify/cors';
import mongodb from '@fastify/mongodb';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import cloudinary from 'fastify-cloudinary';

import router from '~/plugins/router';
import websocket from '~/plugins/websocket';
import eventsource from '~/plugins/eventsource';
import i18n from '~/plugins/i18n';

const app = async (options: FastifyServerOptions = {}) => {
  const app = fastify(options);
  app.register(import('./error'));

  app.register(cors, { origin: process.env.SITE_URL });
  app.register(mongodb, { url: process.env.MONGODB_URL });
  app.register(jwt, { secret: process.env.SECRET_KEY });
  app.register(multipart);
  app.register(cloudinary, { url: process.env.CLOUDINARY_URL });

  app.register(router, { prefix: '/api' });
  app.register(websocket, { prefix: '/api' });
  app.register(eventsource, { prefix: '/api' });
  app.register(i18n);

  return app;
};

export default app;
