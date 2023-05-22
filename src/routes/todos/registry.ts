import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

import useTableControl, { TableControlBox } from '~/composables/useTableControl';

import type { TodoItem } from './types';
import { body, message, entity } from './schema';

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();

  /*
  curl --request POST \
    --url http://127.0.0.1:3000/api/todos \
    --header 'content-type: application/json' \
    --data '{}' | json_pp
  */
  router.post(
    '',
    {
      schema: {
        body: Type.Intersect([Type.Partial(body), TableControlBox]),
        response: {
          200: Type.Object({ message, result: Type.Array(entity), total: Type.Integer() }),
        },
      },
    },
    async (req, reply) => {
      const todos = app.mongo.db?.collection('todos');

      const { page, rows, field, direction } = useTableControl(req);
      const { title, filter } = req.body;

      let queryTitle = {};

      if (title) {
        queryTitle = { title: { $regex: title, $options: 'i' } };
      }

      let queryCompleted = {};

      enum Filter {
        All,
        Active,
        Completed,
      }

      if (filter === Filter.Active) {
        queryCompleted = { completed: { $eq: false } };
      }

      if (filter === Filter.Completed) {
        queryCompleted = { completed: { $eq: true } };
      }

      const queryConditions = { ...queryTitle, ...queryCompleted };

      const result = await todos
        ?.find<TodoItem>(queryConditions)
        .sort(field, direction)
        .limit(rows)
        .skip(rows * (page - 1))
        .toArray();

      const total = await todos?.countDocuments(queryConditions);

      return reply.send({ message: 'OK', result: result || [], total: total || 0 });
    },
  );
};
