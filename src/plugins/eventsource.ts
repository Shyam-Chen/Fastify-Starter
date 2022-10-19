import plugin from 'fastify-plugin';
import { FastifySSEPlugin } from 'fastify-sse-v2';

export default plugin(
  async (app, opts) => {
    const { prefix } = opts;

    app.register(FastifySSEPlugin);

    app.register(import('~/modules/sse/registry'), { prefix });
  },
  { name: 'eventsource' },
);
