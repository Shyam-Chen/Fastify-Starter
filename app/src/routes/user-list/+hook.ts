import plugin from 'fastify-plugin';

import auth from '~/middleware/auth';

export default plugin(async (app) => {
  app.addHook('onRequest', auth);
});
