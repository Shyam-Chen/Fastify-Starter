import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createCache } from 'async-cache-dedupe';
import { Type } from 'typebox';

import redisInstance from '~/utilities/redisInstance';

export default (async (app) => {
  const cache = createCache({
    ttl: 5,
    storage: { type: 'redis', options: { client: redisInstance } },
  });

  const useCache = cache.define('redisText', async (id) => {
    console.log('id =', id);
    return { message: 'OK', id };
  });

  /*
  ```sh
  # this will trigger the log: id = 1
  $ curl --request GET --url http://127.0.0.1:3000/api/hello-world/caching-dedupe/1-redis
  # response: { "message": "OK", "id": "1" }

  # this won't trigger the log
  $ curl --request GET --url http://127.0.0.1:3000/api/hello-world/caching-dedupe/1-redis
  # response: { "message": "OK", "id": "1" }

  # this will trigger the log: id = 2
  $ curl --request GET --url http://127.0.0.1:3000/api/hello-world/caching-dedupe/2-redis
  # response: { "message": "OK", "id": "2" }
  ```
  */
  app.get(
    '',
    {
      schema: {
        params: Type.Object({
          id: Type.String(),
        }),
        response: {
          200: Type.Object({
            message: Type.String(),
            id: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const cached = await useCache.redisText(id);

      return reply.send(cached);
    },
  );
}) as FastifyPluginAsyncTypebox;
