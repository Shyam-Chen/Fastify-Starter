import type { FastifyInstance, RouteShorthandOptions } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Static, Type, TObject } from '@sinclair/typebox';

const behavior = Type.Object({
  field: Type.Optional(Type.String()),
  order: Type.Optional(Type.Union([Type.Literal('asc'), Type.Literal('desc')])),
  page: Type.Optional(Type.String()),
  rows: Type.Optional(Type.String()),
});

const message = Type.String();

// POST / {}

// const body = Type.Object({
//   title: Type.String(),
//   completed: Type.Optional(Type.Boolean()),
// });

// CollectionData(app, {
//   collection: 'todos',
//   body,
//   queryConditions(_body: Static<typeof body>) {
//     const { title, completed } = _body;

//     return {
//       ...(title && { title: { $regex: title, $options: 'i' } }),
//       ...(completed && { completed: { $eq: completed } }),
//     };
//   },
// });

interface CollectionDataOptions {
  collection: string;
  body: TObject;
  queryConditions: (reqBody: any) => any;
  options?: RouteShorthandOptions;
}

export default async (app: FastifyInstance, opts: CollectionDataOptions) => {
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

  const route = {
    options: {
      schema: {
        body: Type.Intersect([Type.Partial(body), behavior]),
        response: {
          200: Type.Object({ message, result: Type.Array(entity), total: Type.Integer() }),
        },
      },
    },
  };

  if (opts.options) {
    route.options = { ...opts.options, ...route.options };
  }

  router.post('/', route.options, async (req, reply) => {
    const field = req.body.field || 'createdAt';
    const order = req.body.order || 'desc';
    const page = Number(req.body.page) || 1;
    const rows = Number(req.body.rows) || 10;

    const queryConditions = opts?.queryConditions(req.body) || {};

    const result = await collection
      ?.find<Static<typeof entity>>(queryConditions)
      .sort(field, order)
      .limit(rows)
      .skip(rows * (page - 1))
      .toArray();

    const total = await collection?.countDocuments(queryConditions);

    return reply.send({ message: 'OK', result: result || [], total: total || 0 });
  });
};
