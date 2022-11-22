import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Static, Type } from '@sinclair/typebox';

const body = Type.Object({});

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

// POST /new {}
// GET /:id
// PUT /:id {}
// DELETE /:id

// CrudOperations(app, {
//   collection: 'todos',
//   body: Type.Object({
//     title: Type.String(),
//     completed: Type.Optional(Type.Boolean()),
//   }),
// });

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();
  const collection = app.mongo.db?.collection('__COLLECTION_NAME__');

  router.post(
    '/new',
    {
      schema: {
        body,
        response: { 200: Type.Object({ message }) },
      },
    },
    async (req, reply) => {
      await collection?.insertOne({
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return reply.send({ message: 'OK' });
    },
  );

  router.get(
    '/:id',
    {
      schema: {
        params,
        response: { 200: Type.Object({ message, result: Type.Partial(entity) }) },
      },
    },
    async (req, reply) => {
      const result = await collection?.findOne<Static<typeof entity>>({
        _id: { $eq: new app.mongo.ObjectId(req.params.id) },
      });

      return reply.send({ message: 'OK', result: result || {} });
    },
  );

  router.put(
    '/:id',
    {
      schema: {
        params,
        body,
        response: { 200: Type.Object({ message }) },
      },
    },
    async (req, reply) => {
      await collection?.updateOne(
        { _id: { $eq: new app.mongo.ObjectId(req.params.id) } },
        {
          $set: {
            ...req.body,
            updatedAt: new Date().toISOString(),
          },
        },
      );

      return reply.send({ message: 'OK' });
    },
  );

  router.delete(
    '/:id',
    {
      schema: {
        params,
        response: { 200: Type.Object({ message }) },
      },
    },
    async (req, reply) => {
      await collection?.deleteOne({
        _id: { $eq: new app.mongo.ObjectId(req.params.id) },
      });

      return reply.send({ message: 'OK' });
    },
  );
};
