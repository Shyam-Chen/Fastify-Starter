import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/nested/products
  */
  router.get('/', async (request, reply) => {
    return reply.send('/nested/products');
  });
};
