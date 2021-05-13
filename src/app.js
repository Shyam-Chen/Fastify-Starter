import fastify from 'fastify';
import helmet from 'fastify-helmet';
import cors from 'fastify-cors';
import rateLimit from 'fastify-rate-limit';
import compress from 'fastify-compress';
// import jwt from 'fastify-jwt';
// import auth from 'fastify-auth';
// import oauth2 from 'fastify-oauth2';
import cookie from 'fastify-cookie';
import session from 'fastify-session';

import router from '~/core/router';
// import apolloServer from '~/core/apollo-server';

export default (opts = {}) => {
  const app = fastify(opts);

  app.register(helmet);
  app.register(cors);
  app.register(rateLimit);
  app.register(compress);
  // app.register(jwt);
  // app.register(auth);
  // app.register(oauth2);
  app.register(cookie);
  app.register(session, { secret: process.env.SECRET });

  app.register(router, { prefix: '/' });
  // app.register(apolloServer.createHandler());

  return app;
};
