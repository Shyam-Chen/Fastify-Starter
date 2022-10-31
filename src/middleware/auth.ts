import type { FastifyRequest, FastifyReply } from 'fastify';

export default async <T extends FastifyRequest, U extends FastifyReply>(request: T, reply: U) => {
  await request.jwtVerify();
};
