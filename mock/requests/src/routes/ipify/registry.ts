import type { FastifyInstance } from 'fastify';
import responses from 'responses/ipify';

export default async (app: FastifyInstance) => {
  // curl http://localhost:6000/api/ipify
  app.get('', async () => {
    return responses.ip;
  });
};
