import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

import type { TodoItem } from './types';
import { body, behavior, message, entity } from './schema';

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();
  const todos = app.mongo.db?.collection('todos');

  /*
  curl --request POST \
    --url http://127.0.0.1:3000/api/todos \
    --header 'content-type: application/json' \
    --data '{}' | json_pp
  */
  router.post(
    '/',
    {
      schema: {
        body: Type.Intersect([Type.Partial(body), behavior]),
        response: {
          200: Type.Object({ message, result: Type.Array(entity), total: Type.Integer() }),
        },
      },
    },
    async (req, reply) => {
      const field = req.body.field || 'createdAt';
      const order = req.body.order || 'desc';
      const page = Number(req.body.page) || 1;
      const rows = Number(req.body.rows) || 10;

      const { title, completed } = req.body;

      const queryConditions = {
        ...(title && { title: { $regex: title, $options: 'i' } }),
        ...(completed && { completed: { $eq: completed } }),
      };

      const result = await todos
        ?.find<TodoItem>(queryConditions)
        .sort(field, order)
        .limit(rows)
        .skip(rows * (page - 1))
        .toArray();

      const total = await todos?.countDocuments(queryConditions);

      return reply.send({ message: 'OK', result: result || [], total: total || 0 });
    },
  );
};
