import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default (app: FastifyInstance) => {
  return async <T extends FastifyRequest, U extends FastifyReply>(request: T, reply: U) => {
    const payload = await request.jwtVerify();
    // @ts-ignore
    const refreshToken = await app.redis.get(`${payload.username}+${payload.uuid}`);
    if (!refreshToken) return reply.gone();
  };
};
