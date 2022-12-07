import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/nested/marketing
  */
  router.get('/', async (request, reply) => {
    return reply.send('/nested/marketing');
  });

  app.register(import('./[id]/registry'), { prefix: '/:id' });
};
