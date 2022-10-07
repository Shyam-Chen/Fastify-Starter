import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  app.get('/hello-world', async (req, reply) => {
    return { text: 'Hello, World!' };
  });

  return;
};
