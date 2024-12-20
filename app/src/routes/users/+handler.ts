import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

import useTableControl from '~/composables/useTableControl';

import { RoleBox, UserBox } from './schema';

export default (async (app) => {
  app.post(
    '',
    {
      schema: {
        response: {
          200: Type.Object({
            message: Type.String(),
            result: Type.Array(Type.Intersect([Type.Partial(UserBox), Type.Partial(RoleBox)])),
            total: Type.Number(),
          }),
        },
      },
    },
    async (req, reply) => {
      const users = app.mongo.db?.collection('users');

      const { page, rows, field, direction } = useTableControl(req);

      const conditions = {};

      const result = await users
        ?.find(conditions)
        .project({ password: 0, secret: 0 })
        .sort(field, direction)
        .limit(rows)
        .skip(rows * (page - 1))
        .toArray();

      const total = await users?.countDocuments(conditions);

      return reply.send({
        message: 'OK',
        result: result || [],
        total: total || 0,
      });
    },
  );
}) as FastifyPluginAsyncTypebox;
