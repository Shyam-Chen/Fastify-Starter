import type { FastifyInstance } from 'fastify';
import undici from 'undici';

export default async (app: FastifyInstance) => {
  app.get('', async (_request, reply) => {
    reply.raw.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');

    const response = await undici.request('http://localhost:4000/api/path/to/sse', {
      method: 'GET',
      headers: {
        Accept: 'text/event-stream',
      },
    });

    const readable = response.body;

    for await (const chunk of readable) {
      reply.raw.write(chunk);
    }

    reply.raw.end();
  });
};
