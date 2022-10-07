import plugin from 'fastify-plugin';
import websocket from '@fastify/websocket';

import echo from '~/modules/echo';

export default plugin(
  async (app, opts) => {
    const { prefix } = opts;

    app.register(websocket);

    app.register(echo, { prefix });

    return;
  },
  { name: 'websocket' },
);
