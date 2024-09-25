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
      const model = useModel({
        // Replace the model with a fine-tuned model or an embedding model
        model: 'gpt-4o-mini',

        // Allow some creative flexibility to handle variations in phrasing, while maintaining accuracy in responses
        temperature: 0.3,
      });

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
