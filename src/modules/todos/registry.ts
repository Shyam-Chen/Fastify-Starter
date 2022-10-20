import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import type {} from '@fastify/mongodb';
import { Type } from '@sinclair/typebox';

const body = Type.Object({
  title: Type.String(),
  completed: Type.Optional(Type.Boolean()),
});

const querystring = Type.Intersect([
  Type.Partial(body),
  Type.Object({
    filed: Type.Optional(Type.String()),
    order: Type.Optional(Type.Union([Type.Literal('asc'), Type.Literal('desc')])),
    page: Type.Optional(Type.String()),
    rows: Type.Optional(Type.String()),
  }),
]);

const params = Type.Object({
  id: Type.String(),
});

export default (async (app) => {
  const todos = app.mongo.db?.collection('todos');

  /*
  curl --request POST \
    --url http://127.0.0.1:3000/api/todos \
    --header 'content-type: application/json' \
    --data '{
      "title": "foo"
    }'
  */
  app.post('/todos', { schema: { body } }, async (req, reply) => {
    await todos?.insertOne({
      title: req.body.title,
      completed: req.body.completed,
      createdAt: new Date().toISOString(),
    });

    return { message: 'hi' };
  });

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/todos | json_pp

  curl --request GET \
    --url http://127.0.0.1:3000/api/todos?filed=createdAt&order=desc&page=1&rows=10 | json_pp

  curl --request GET \
    --url http://127.0.0.1:3000/api/todos?title=vue | json_pp
  */
  app.get('/todos', { schema: { querystring } }, async (req, reply) => {
    const filed = req.query.filed || 'createdAt';
    const order = req.query.order || 'desc';
    const page = Number(req.query.page) || 1;
    const rows = Number(req.query.rows) || 10;

    const { title, completed } = req.query;

    const result = await todos
      ?.find({
        ...(title && { title: { $regex: title, $options: 'i' } }),
        ...(completed && { completed: { $regex: completed, $options: 'i' } }),
      })
      .sort(filed, order)
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
  app.get('/todos/:id', { schema: { params } }, async (req, reply) => {
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
  app.put('/todos/:id', { schema: { body, params } }, async (req, reply) => {
    await todos?.updateOne(
      { _id: { $eq: new app.mongo.ObjectId(req.params.id) } },
      {
        $set: {
          title: req.body.title,
          completed: req.body.completed,
          updatedAt: new Date().toISOString(),
        },
      },
    );

    return { message: 'hi' };
  });

  /*
  curl --request DELETE \
    --url http://127.0.0.1:3000/api/todos/634516681a8fd0d3cd9791f1
  */
  app.delete('/todos/:id', { schema: { params } }, async (req, reply) => {
    await todos?.deleteOne({ _id: { $eq: new app.mongo.ObjectId(req.params.id) } });
    return { message: 'hi' };
  });
}) as FastifyPluginAsyncTypebox;
