import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import useTableControl from '~/composables/useTableControl';
import auth from '~/middleware/auth';

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();

  router.post(
    '/',
    {
      onRequest: [auth],
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
        message: 'Hi!',
        result: result || [],
        total: total || 0,
      });
    },
  );
};
