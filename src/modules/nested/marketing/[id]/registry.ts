import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

const params = Type.Object({ id: Type.String() });

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/nested/marketing/634787af6d44cfba9c0df8ea
  */
  router.get('/', { schema: { params } }, async (request, reply) => {
    return reply.send(`/nested/marketing/${request.params.id}`);
  });
};
