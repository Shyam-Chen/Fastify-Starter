import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

import useQueue from '~/composables/useQueue';
import useWorker from '~/composables/useWorker';

export default (async (app) => {
  /*
  $ curl --request GET \
         --url http://127.0.0.1:3000/api/queues?color=blue
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
      const paintQueue = useQueue('Paint');

      await paintQueue.add(
        'wall',
        { color: req.query.color },
        {
          removeOnComplete: true,
        },
      );

      // worker.js {%
      useWorker(
        'Paint',
        async (job) => {
          console.log('[Paint] Starting job:', job.name);
          console.log(job.id, job.name, job.data);
          console.log('[Paint] Finished job:', job.name);
          return;
        },
        {
          removeOnComplete: { count: 0 },
          removeOnFail: { count: 0 },
        },
      );
      // %}

      return reply.send({ message: 'OK' });
    },
  );
}) as FastifyPluginAsyncTypebox;
