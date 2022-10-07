import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  app.get('/sse', (req, reply) => {
    let index = 0;

    reply.sse({ id: String(index), data: 'Some message' });

    const interval = setInterval(() => {
      index += 1;

      reply.sse({ id: index, data: `Some message ${index}` });

      if (index === 10) {
        clearInterval(interval);
      }
    }, 1000);
  });

  return;
};
