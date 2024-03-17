import { EventEmitter } from 'node:events';
import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  const sseEmitter = new EventEmitter();

  app.get('', (req, reply) => {
    let index = 0;

    sseEmitter.on('send', (data) => {
      index += 1;
      reply.sse({ id: String(index), data: JSON.stringify(data) });
    });
  });

  /*
  $ curl --request POST \
         --url http://127.0.0.1:3000/api/sse/event \
         --header 'content-type: application/json' \
         --data '{ "message": "test" }'
  */
  app.post('', async (req, reply) => {
    sseEmitter.emit('send', req.body);
    return reply.send({ message: 'OK' });
  });
};
