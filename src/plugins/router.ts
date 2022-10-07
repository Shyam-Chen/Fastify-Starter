import plugin from 'fastify-plugin';

import helloWorld from '~/modules/hello-world';
import signIn from '~/modules/sign-in';

export default plugin(
  async (app, opts) => {
    const { prefix } = opts;

    app.register(helloWorld, { prefix });
    app.register(signIn, { prefix });

    return;
  },
  { name: 'router' },
);
