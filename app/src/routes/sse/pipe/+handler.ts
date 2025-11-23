import type { FastifyInstance } from 'fastify';
import { request } from 'undici';

export default async (app: FastifyInstance) => {
  app.get('', async (req, reply) => {
    reply.raw.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');

    const bar = await request('http://localhost:4000/api/path/to/sse', {
      method: 'GET',
      headers: {
        Accept: 'text/event-stream',
      },
    });

    const readable = bar.body;

    for await (const chunk of readable) {
      reply.raw.write(chunk);
    }

    reply.raw.end();
  });
};
