import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  app.register(import('./registry'));
  app.register(import('./[id]/registry'), { prefix: '/:id' });
};
