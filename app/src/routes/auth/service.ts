import type { FastifyInstance } from 'fastify';

export default {
  async signToken(app: FastifyInstance, { username, uuid }: { username: string; uuid: string }) {
    const accessToken = app.jwt.sign({ username, uuid }, { expiresIn: '20m' });
    const refreshToken = app.jwt.sign({ uuid }, { expiresIn: '12h' });
    await app.redis.set(`${username}+${uuid}`, refreshToken, 'EX', 12 * 60 * 60);
    return { accessToken, refreshToken };
  },
};
