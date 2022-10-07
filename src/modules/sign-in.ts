import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  app.post('/sign-in', async (req, reply) => {
    return { token: 'xxx' };
  });

  return;
};
