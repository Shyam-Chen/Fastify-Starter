import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

import useQueue from '~/composables/useQueue';
import useWorker from '~/composables/useWorker';

const paintQueue = useQueue('Paint');

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/queues?color=blue
  */
  router.get(
    '',
    {
      schema: {
        querystring: Type.Object({ color: Type.String() }),
        response: { 200: Type.Object({ message: Type.String() }) },
      },
    },
    async (req, reply) => {
      await paintQueue.add(
        'wall',
        { color: req.query.color },
        {
          removeOnComplete: true,
          // repeat: { pattern: '45 * * * * *' },
        },
      );

      return reply.send({ message: 'OK' });
    },
  );

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/queues/drain
  */
  router.get(
    '/drain',
    {
      schema: {
        response: { 200: Type.Object({ message: Type.String() }) },
      },
    },
    async (req, reply) => {
      await paintQueue.drain();
      return reply.send({ message: 'OK' });
    },
  );
};

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
