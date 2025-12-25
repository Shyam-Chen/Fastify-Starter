import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from 'typebox';

export default (async (app) => {
  app.post(
    '',
    {
      schema: {
        response: {
          200: Type.Object({
            message: Type.String(),
          }),
        },
      },
    },
    async (req, reply) => {
      // const users = app.mongo.db?.collection('users');

      return reply.send({
        message: 'OK',
      });
    },
  );
}) as FastifyPluginAsyncTypebox;
