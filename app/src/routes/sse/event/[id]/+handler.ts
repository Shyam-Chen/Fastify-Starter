import { EventEmitter } from 'node:events';
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

export default (async (app) => {
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

      sseEmitter.on(`/sse/event/${id}`, (data) => {
        reply.sse({ id, data });
      });

      req.raw.on('close', () => {
        reply.sse({ event: 'close' });
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
