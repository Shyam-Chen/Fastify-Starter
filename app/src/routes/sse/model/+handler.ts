import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

import useModel from '~/composables/useModel';

export default (async (app) => {
  app.post(
    '',
    {
      schema: {
        body: Type.Object({
          message: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const model = useModel({ model: 'gpt-4o-mini', temperature: 0 });

      const stream = await model.stream(request.body.message);

      for await (const chunk of stream) {
        reply.sse(chunk);
      }

      request.raw.on('close', async () => {
        await stream.cancel();
        reply.sse({ event: 'close' });
      });
    },
  );
}) as FastifyPluginAsyncTypebox;
