import plugin from 'fastify-plugin';

import auth from '~/middleware/auth.ts';
// import session from '~/middleware/session.ts';

export default plugin(async (app) => {
  app.addHook('onRequest', auth);
  // app.addHook('preValidation', session(app));
});
