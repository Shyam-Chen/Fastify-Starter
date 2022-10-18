import plugin from 'fastify-plugin';
import websocket from '@fastify/websocket';

export default plugin(
  async (app, opts) => {
    const { prefix } = opts;

    app.register(websocket);

    app.register(import('~/modules/echo'), { prefix });
  },
  { name: 'websocket' },
);
