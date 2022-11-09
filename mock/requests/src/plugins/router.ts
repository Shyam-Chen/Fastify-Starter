import plugin from 'fastify-plugin';

import ipify from '~/modules/ipify';

export default plugin(
  async (app, opts) => {
    const { prefix } = opts;

    app.register(ipify, { prefix: prefix + '/ipify' });
  },
  { name: 'router' },
);
