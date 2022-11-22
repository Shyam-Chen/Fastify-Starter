import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type, Static } from '@sinclair/typebox';

const body = Type.Object({
  title: Type.String(),
  completed: Type.Optional(Type.Boolean()),
});

const behavior = Type.Object({
  field: Type.Optional(Type.String()),
  order: Type.Optional(Type.Union([Type.Literal('asc'), Type.Literal('desc')])),
  page: Type.Optional(Type.String()),
  rows: Type.Optional(Type.String()),
});

const params = Type.Object({
  id: Type.String(),
});

const message = Type.String();

const entity = Type.Intersect([
  Type.Required(body),
  Type.Object({
    _id: Type.String(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
  }),
]);

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
    '/todos',
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
        ?.find<Static<typeof entity>>(queryConditions)
        .sort(field, order)
        .limit(rows)
        .skip(rows * (page - 1))
        .toArray();

      const total = await todos?.countDocuments(queryConditions);

      return reply.send({ message: 'OK', result: result || [], total: total || 0 });
    },
  );

  /*
  curl --request POST \
    --url http://127.0.0.1:3000/api/todos/new \
    --header 'content-type: application/json' \
    --data '{
      "title": "foo"
    }'
  */
  router.post(
    '/todos/new',
    {
      schema: {
        body,
        response: { 200: Type.Object({ message }) },
      },
    },
    async (req, reply) => {
      await todos?.insertOne({
        title: req.body.title,
        completed: req.body.completed,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return reply.send({ message: 'OK' });
    },
  );

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/todos/634787af6d44cfba9c0df8ea
  */
  router.get(
    '/todos/:id',
    {
      schema: {
        params,
        response: { 200: Type.Object({ message, result: Type.Partial(entity) }) },
      },
    },
    async (req, reply) => {
      const result = await todos?.findOne<Static<typeof entity>>({
        _id: { $eq: new app.mongo.ObjectId(req.params.id) },
      });

      return reply.send({ message: 'OK', result: result || {} });
    },
  );

  /*
  curl --request PUT \
    --url http://127.0.0.1:3000/api/todos/634516681a8fd0d3cd9791f1 \
    --header 'content-type: application/json' \
    --data '{
      "title": "foo",
      "completed": true
    }'
  */
  router.put(
    '/todos/:id',
    {
      schema: {
        params,
        body,
        response: { 200: Type.Object({ message }) },
      },
    },
    async (req, reply) => {
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

      return reply.send({ message: 'OK' });
    },
  );

  /*
  curl --request DELETE \
    --url http://127.0.0.1:3000/api/todos/634516681a8fd0d3cd9791f1
  */
  router.delete(
    '/todos/:id',
    {
      schema: {
        params,
        response: { 200: Type.Object({ message }) },
      },
    },
    async (req, reply) => {
      await todos?.deleteOne({ _id: { $eq: new app.mongo.ObjectId(req.params.id) } });
      return reply.send({ message: 'OK' });
    },
  );
};
