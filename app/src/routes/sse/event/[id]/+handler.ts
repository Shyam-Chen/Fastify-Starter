import { EventEmitter } from 'node:events';
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

export default (async (app) => {
  // When integrating with BullMQ, Redis Pub/Sub can be used to trigger SSE
  const sseEmitter = new EventEmitter();

  app.get(
    '',
    {
      schema: {
        params: Type.Object({
          id: Type.String(),
        }),
      },
    },
    (req, reply) => {
      const { id } = req.params;

      function eventId(data?: string | object) {
        reply.sse({ id, data });
        reply.sse({ event: 'end' });
      }

      sseEmitter.on(`/sse/event/${id}`, eventId);

      req.raw.on('close', () => {
        sseEmitter.off(`/sse/event/${id}`, eventId);
      });
    },
  );

  app.post(
    '',
    {
      schema: {
        params: Type.Object({
          id: Type.String(),
        }),
      },
    },
    async (req, reply) => {
      const { id } = req.params;
      sseEmitter.emit(`/sse/event/${id}`, req.body);
      return reply.send({ message: 'Data sent to client' });
    },
  );
}) as FastifyPluginAsyncTypebox;
