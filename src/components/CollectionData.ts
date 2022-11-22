import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Static, Type } from '@sinclair/typebox';

const body = Type.Object({});

const queryConditions = {};

const behavior = Type.Object({
  field: Type.Optional(Type.String()),
  order: Type.Optional(Type.Union([Type.Literal('asc'), Type.Literal('desc')])),
  page: Type.Optional(Type.String()),
  rows: Type.Optional(Type.String()),
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

// POST / {}

// const body = Type.Object({
//   title: Type.String(),
//   completed: Type.Optional(Type.Boolean()),
// });

// CollectionData(app, {
//   collection: 'todos',
//   body,
//   queryConditions(body: Static<typeof body>) {
//     const { title, completed } = body;

//     return {
//       ...(title && { title: { $regex: title, $options: 'i' } }),
//       ...(completed && { completed: { $eq: completed } }),
//     };
//   },
// });

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();
  const collection = app.mongo.db?.collection('__COLLECTION_NAME__');

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

      const result = await collection
        ?.find<Static<typeof entity>>(queryConditions)
        .sort(field, order)
        .limit(rows)
        .skip(rows * (page - 1))
        .toArray();

      const total = await collection?.countDocuments(queryConditions);

      return reply.send({ message: 'OK', result: result || [], total: total || 0 });
    },
  );
};
