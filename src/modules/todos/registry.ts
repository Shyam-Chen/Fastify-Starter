import type { FastifyInstance } from 'fastify';

import type { TodoItemType, TodoIdType } from './schema';
import { TodoItem, TodoId } from './schema';

export default async (app: FastifyInstance) => {
  // app.addHook('onRequest', (req) => req.jwtVerify());

  const todos = app.mongo.db?.collection('todos');

  /*
  curl --request POST \
    --url http://127.0.0.1:3000/api/todos \
    --header 'content-type: application/json' \
    --data '{
      "title": "foo"
    }'
  */
  app.post<{ Body: TodoItemType }>('/todos', { schema: { body: TodoItem } }, async (req, reply) => {
    await todos?.insertOne(req.body);
    return { message: 'hi' };
  });

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/todos | json_pp

  curl --request GET \
    --url http://127.0.0.1:3000/api/todos?page=2&rows=5 | json_pp
  */
  app.get<{ Querystring: { page?: number; rows?: number } }>('/todos', async (req, reply) => {
    const page = Number(req.query.page) || 1;
    const rows = Number(req.query.rows) || 10;

    const result = await todos
      ?.find()
      .limit(rows)
      .skip(rows * (page - 1))
      .toArray();

    const total = await todos?.countDocuments();

    return { message: 'hi', result, total };
  });

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/todos/634787af6d44cfba9c0df8ea
  */
  app.get<{ Params: TodoIdType }>('/todos/:id', async (req, reply) => {
    const result = await todos?.findOne({ _id: { $eq: new app.mongo.ObjectId(req.params.id) } });
    return { message: 'hi', result };
  });

  /*
  curl --request PUT \
    --url http://127.0.0.1:3000/api/todos/634516681a8fd0d3cd9791f1 \
    --header 'content-type: application/json' \
    --data '{
      "title": "foo",
      "completed": true
    }'
  */
  app.put<{ Params: TodoIdType; Body: TodoItemType }>(
    '/todos/:id',
    { schema: { params: TodoId, body: TodoItem } },
    async (req, reply) => {
      await todos?.updateOne(
        { _id: { $eq: new app.mongo.ObjectId(req.params.id) } },
        {
          $set: {
            title: req.body.title,
            completed: req.body.completed,
          },
        },
      );

      return { message: 'hi' };
    },
  );

  /*
  curl --request DELETE \
    --url http://127.0.0.1:3000/api/todos/634516681a8fd0d3cd9791f1
  */
  app.delete<{ Params: TodoIdType }>('/todos/:id', async (req, reply) => {
    await todos?.deleteOne({ _id: { $eq: new app.mongo.ObjectId(req.params.id) } });
    return { message: 'hi' };
  });
};
