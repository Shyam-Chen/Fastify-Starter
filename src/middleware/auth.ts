import type { FastifyRequest, FastifyReply } from 'fastify';

export default async (request: FastifyRequest, reply: FastifyReply) => {
  await request.jwtVerify();
};
