import type { FastifyInstance } from 'fastify';

// GET /?page=1&rows=10
export default async (app: FastifyInstance, opts) => {
  app.get('/', { schema: opts.schema }, async (req, reply) => {
    const page = Number(req.query.page) || 1;
    const rows = Number(req.query.rows) || 10;

    const result = await opts.collection
      ?.find()
      .limit(rows)
      .skip(rows * (page - 1))
      .toArray();

    const total = await opts.collection?.countDocuments();

    return { message: 'hi', result, total };
  });
};
