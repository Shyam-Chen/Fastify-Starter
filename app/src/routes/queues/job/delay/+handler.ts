import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

import useJobber from '~/composables/useJobber';

export default (async (app) => {
  /*
  $ curl --request GET \
         --url http://127.0.0.1:3000/api/queues/job/delay?color=blue
  */
  app.get(
    '',
    {
      schema: {
        querystring: Type.Object({ color: Type.String() }),
        response: { 200: Type.Object({ message: Type.String() }) },
      },
    },
    async (req, reply) => {
      const jobber = useJobber({
        jobs: [{ name: 'world', timeout: 3000 }],
      });

      await jobber.start();

      return reply.send({ message: 'OK' });
    },
  );
}) as FastifyPluginAsyncTypebox;
