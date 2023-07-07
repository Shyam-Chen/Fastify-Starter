import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { caching } from 'cache-manager';

export default (async (app) => {
  const cache = await caching('memory', { ttl: 10 * 1000, max: 500 });

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/hello-world/caching?text=foo

  curl --request GET \
    --url http://127.0.0.1:3000/api/hello-world/caching?text=bar
  */
  app.get(
    '',
    {
      schema: {
        querystring: Type.Object({
          text: Type.String(),
        }),
        response: {
          200: Type.Object({
            message: Type.String(),
          }),
        },
      },
    },
    async (req, reply) => {
      const { text } = req.query;

      const cached = await cache.wrap('hello', async () => {
        return { message: text };
      });

      return reply.send(cached);
    },
  );
}) as FastifyPluginAsyncTypebox;
