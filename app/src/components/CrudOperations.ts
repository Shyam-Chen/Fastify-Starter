import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { FastifyInstance } from 'fastify';
import { type Static, type TObject, Type } from 'typebox';

// POST /:id=new {}
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

interface CrudOperationsOptions {
  collection: string;
  body: TObject;
}

const params = Type.Object({ id: Type.String() });
const message = Type.String();

export default async (app: FastifyInstance, opts: CrudOperationsOptions) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();
  const collection = app.mongo.db?.collection(opts.collection);

  let body = Type.Object({});
  if (opts.body) body = opts.body;

  const entity = Type.Intersect([
    Type.Required(body),
    Type.Object({
      _id: Type.String(),
      createdAt: Type.String({ format: 'date-time' }),
      updatedAt: Type.String({ format: 'date-time' }),
    }),
  ]);

  router.post(
    '',
    {
      schema: {
        params: Type.Object({ id: Type.Literal('new') }),
        body,
        response: { 200: Type.Object({ message }) },
      },
    },
    async (request, reply) => {
      await collection?.insertOne({
        ...request.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return reply.send({ message: 'OK' });
    },
  );

  router.get(
    '',
    {
      schema: {
        params,
        response: { 200: Type.Object({ message, result: Type.Partial(entity) }) },
      },
    },
    async (request, reply) => {
      const result = await collection?.findOne<Static<typeof entity>>({
        _id: { $eq: new app.mongo.ObjectId(request.params.id) },
      });

      return reply.send({ message: 'OK', result: result || {} });
    },
  );

  router.put(
    '',
    {
      schema: {
        params,
        body,
        response: { 200: Type.Object({ message }) },
      },
    },
    async (request, reply) => {
      await collection?.updateOne(
        { _id: { $eq: new app.mongo.ObjectId(request.params.id) } },
        {
          $set: {
            ...request.body,
            updatedAt: new Date().toISOString(),
          },
        },
      );

      return reply.send({ message: 'OK' });
    },
  );

  router.delete(
    '',
    {
      schema: {
        params,
        response: { 200: Type.Object({ message }) },
      },
    },
    async (request, reply) => {
      await collection?.deleteOne({
        _id: { $eq: new app.mongo.ObjectId(request.params.id) },
      });

      return reply.send({ message: 'OK' });
    },
  );
};
