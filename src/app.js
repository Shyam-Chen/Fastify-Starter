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

const app = fastify({ logger: true });

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

app.listen(process.env.SITE_PORT, process.env.HOST_NAME, (err, address) => {
  if (err) throw err;
  app.log.info(`Application listening on ${address}`);
});

if (module.hot) {
  module.hot.accept();
}

export default app;
