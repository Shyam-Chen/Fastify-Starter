import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

import useQueue from '~/composables/useQueue';

export default (async (app) => {
  /*
  $ curl --request GET \
         --url http://127.0.0.1:3000/api/queues/drain
  */
  app.get(
    '',
    {
      schema: {
        response: { 200: Type.Object({ message: Type.String() }) },
      },
    },
    async (req, reply) => {
      const paintRenewQueue = useQueue('PaintRenew');
      await paintRenewQueue.drain();
      return reply.send({ message: 'OK' });
    },
  );
}) as FastifyPluginAsyncTypebox;
