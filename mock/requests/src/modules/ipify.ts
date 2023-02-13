import type { FastifyInstance } from 'fastify';
import responses from 'responses/ipify';

export default async (app: FastifyInstance) => {
  app.get('/', async () => {
    return responses.ip;
  });
};
