import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default (app: FastifyInstance) => {
  return async <T extends FastifyRequest, U extends FastifyReply>(request: T, reply: U) => {
    const users = app.mongo.db?.collection('users');
    const roles = app.mongo.db?.collection('roles');

    const user = await users?.findOne(
      { username: { $eq: request.user.username } },
      { projection: { password: 0, secret: 0 } },
    );

    const role = await roles?.findOne(
      { userId: { $ref: 'users', $id: user?._id } },
      { projection: { role: 1, permissions: 1 } },
    );

    if (role?.role !== 'admin') return reply.forbidden();
  };
};
