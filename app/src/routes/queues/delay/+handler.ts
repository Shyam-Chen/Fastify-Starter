import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from 'typebox';

import useQueue from '~/composables/useQueue.ts';
import useWorker from '~/composables/useWorker.ts';

export default (async (app) => {
  /*
  $ curl --request GET \
         --url http://127.0.0.1:3000/api/queues/delay?color=blue
  */
  app.get(
    '',
    {
      schema: {
        querystring: Type.Object({ color: Type.String() }),
        response: { 200: Type.Object({ message: Type.String() }) },
      },
    },
    async (request, reply) => {
      const paintQueue = useQueue('Paint');

      // Add a job that will be delayed by at least 3 seconds
      await paintQueue.add(
        'wall',
        { color: request.query.color },
        {
          removeOnComplete: true,
          delay: 3000,
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
