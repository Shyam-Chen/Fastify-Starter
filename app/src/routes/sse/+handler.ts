import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  app.get('', (req, reply) => {
    let index = 0;

    reply.sse({ id: String(index), data: 'Some message' });

    const interval = setInterval(() => {
      index += 1;

      reply.sse({ id: String(index), data: `Some message ${index}` });

      if (index === 10) {
        clearInterval(interval);
        reply.sse({ event: 'end' });
      }
    }, 1000);

    req.raw.on('close', () => {
      clearInterval(interval);
    });
  });
};
