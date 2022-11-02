import type { FastifyRequest } from 'fastify';

export default async <T extends FastifyRequest>(request: T) => {
  await request.jwtVerify();
};
