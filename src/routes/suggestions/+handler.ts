import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import type { ObjectId } from '@fastify/mongodb';
import { Type } from '@sinclair/typebox';

const querystring = Type.Object({
  value: Type.String(),
  category: Type.Optional(Type.String()),
});

const response = {
  '2xx': Type.Array(
    Type.Object({
      label: Type.String(),
      value: Type.String(),
    }),
  ),
};

export default (async (app) => {
  app.get('', { schema: { querystring, response } }, async (req, reply) => {
    const { value, category = 'suggestions' } = req.query;

    const col = app.mongo.db?.collection(category);

    const result = (await col
      ?.find({
        $or: [
          { label: { $regex: value, $options: 'i' } },
          { value: { $regex: value, $options: 'i' } },
        ],
      })
      .limit(20)
      .toArray()) as Array<{ _id: ObjectId; label: string; value: string }>;

    return reply.send(result);
  });
}) as FastifyPluginAsyncTypebox;
