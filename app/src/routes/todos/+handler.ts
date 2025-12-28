import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from 'typebox';

import useTableControl, { TableControlBox } from '~/composables/useTableControl.ts';

import { body, entity, message } from './schema.ts';
import type { TodoItem } from './types.ts';

export default (async (app) => {
  /*
  $ curl --request POST \
         --url http://127.0.0.1:3000/api/todos \
         --header 'content-type: application/json' \
         --data '{}' | json_pp
  */
  app.post(
    '',
    {
      schema: {
        body: Type.Intersect([Type.Partial(body), TableControlBox]),
        response: {
          200: Type.Object({ message, result: Type.Array(entity), total: Type.Integer() }),
        },
      },
    },
    async (request, reply) => {
      const todos = app.mongo.db?.collection('todos');

      const { page, rows, field, direction } = useTableControl(request);
      const { title, filter } = request.body;

      let queryTitle = {};

      if (title) {
        queryTitle = { title: { $regex: title, $options: 'i' } };
      }

      let queryCompleted = {};

      enum Filter {
        All = 0,
        Active = 1,
        Completed = 2,
      }

      if (filter === Filter.Active) {
        queryCompleted = { completed: { $eq: false } };
      }

      if (filter === Filter.Completed) {
        queryCompleted = { completed: { $eq: true } };
      }

      const queryConditions = { ...queryTitle, ...queryCompleted };

      const [result, total] = await Promise.all([
        todos
          ?.find<TodoItem>(queryConditions)
          .sort(field, direction)
          .limit(rows)
          .skip(rows * (page - 1))
          .toArray(),
        todos?.countDocuments(queryConditions),
      ]);

      return reply.send({ message: 'OK', result: result || [], total: total || 0 });
    },
  );
}) as FastifyPluginAsyncTypebox;
