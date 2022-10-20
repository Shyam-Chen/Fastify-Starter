import type { FastifyInstance } from 'fastify';

// GET /?filed=createdAt&order=desc&page=1&rows=10
export default async (app: FastifyInstance, props) => {
  app.get('/', { schema: props.schema }, async (req, reply) => {
    const filed = req.query.filed || 'createdAt';
    const order = req.query.order || 'desc';
    const page = Number(req.query.page) || 1;
    const rows = Number(req.query.rows) || 10;

    const result = await props.collection
      ?.find(props.find)
      .sort(filed, order)
      .limit(rows)
      .skip(rows * (page - 1))
      .toArray();

    const total = await props.collection?.countDocuments();

    return { message: 'hi', result, total };
  });
};
