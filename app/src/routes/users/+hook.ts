import plugin from 'fastify-plugin';

import auth from '~/middleware/auth';
// import session from '~/middleware/session';

export default plugin(async (app) => {
  app.addHook('onRequest', auth);
  // app.addHook('preValidation', session(app));
});
