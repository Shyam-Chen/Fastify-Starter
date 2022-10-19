import type { FastifyInstance } from 'fastify';

// mock api for https://vue-starter-6fa6.onrender.com
export default async (app: FastifyInstance) => {
  app.post('/sign-in', async (req, reply) => {
    return { token: 'xxx' };
  });
};
