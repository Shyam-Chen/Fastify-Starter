import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Static, Type } from '@sinclair/typebox';
import bcrypt from 'bcrypt';

import auth from '~/middleware/auth';

const body = Type.Object({
  username: Type.String(),
  fullName: Type.String(),
  password: Type.String(),
  email: Type.String({ format: 'email' }),
});

// const body2 = Type.Object({
//   username: Type.String(),
//   password: Type.String(),
// });

// const response = {
//   '2xx': Type.Object({
//     message: Type.String(),
//     token: Type.String(),
//     otpEnabled: Type.Boolean(),
//     otpVerified: Type.Boolean(),
//   }),
// };

// const userResponse = {
//   200: Type.Object({
//     message: Type.String(),
//     username: Type.Optional(Type.String()),
//     fullName: Type.Optional(Type.String()),
//   }),
// };

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: Omit<Static<typeof body>, 'fullName'>;
    user: Omit<Static<typeof body>, 'password'>;
  }
}

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();
  const users = app.mongo.db?.collection('users');
  const roles = app.mongo.db?.collection('roles');

  /*
  User List -> Create a User

  curl --request POST \
    --url http://127.0.0.1:3000/api/auth/sign-up \
    --header 'content-type: application/json' \
    --data '{
      "username": "shyam.chen",
      "fullName": "Shyam Chen",
      "password": "12345678",
      "email": "shyam.chen@example.com"
    }'
  */
  router.post('/sign-up', async (req, reply) => {
    const { username, fullName, password, email } = req.body as any;

    const user = await users?.findOne({ username: { $eq: username } });
    if (user) return reply.badRequest('#username That username is taken. Try another.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = app.jwt.sign({ username, password, email }, { expiresIn: '12h' });

    const userId = new app.mongo.ObjectId();
    await users?.insertOne({ _id: userId, username, fullName, password: hashedPassword, email });

    await roles?.insertOne({
      userId: { $ref: 'users', $id: userId },
      role: 'admin',
      permissions: [{ resource: '*', action: '*' }],
    });

    return reply.send({ message: 'Hi!', token });
  });

  /*
  curl --request POST \
    --url http://127.0.0.1:3000/api/auth/sign-in \
    --header 'content-type: application/json' \
    --data '{
      "username": "shyam.chen",
      "password": "12345678"
    }'
  */
  router.post('/sign-in', async (req, reply) => {
    const { username, password } = req.body as any;

    const user = await users?.findOne({ username: { $eq: username } });
    if (!user) return reply.badRequest(`#username Couldn't find your account.`);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.badRequest(
        '#password Wrong password. Try again or click Forgot password to reset it.',
      );
    }

    if (user.otpEnabled && user.otpVerified) {
      return reply.send({
        message: 'Hi!',
        token: null,
        otpEnabled: true,
        otpVerified: true,
      });
    }

    const token = app.jwt.sign(
      { username, password: user.password, email: user.email },
      { expiresIn: '12h' },
    );

    return reply.send({
      message: 'Hi!',
      token,
      otpEnabled: user.otpEnabled,
      otpVerified: user.otpVerified,
    });
  });

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/auth/user

  curl --request GET \
    --url http://127.0.0.1:3000/api/auth/user \
    --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibWF0dGVvLmNvbGxpbmEiLCJwYXNzd29yZCI6IiQyYiQxMCRUZDRRYUJzYWc2ak1mSjdpVllPS2Z1enVncTJDOXVoVGc1bXZnOHFtRDNwSmo5Rzd5VUwveSIsImlhdCI6MTY2NjkyMjY2OCwiZXhwIjoxNjY2OTgwMjY4fQ.Fkvc0t2kNT8VuvpGbweA6ZErPCJD85kHIgHryyC0W5M"
  */
  router.get('/user', { onRequest: [auth] }, async (req, reply) => {
    const user = await users?.findOne<Static<typeof body>>({
      username: { $eq: req.user.username },
    });

    return reply.send({
      message: 'Hi!',
      username: user?.username,
      fullName: user?.fullName,
      email: user?.email,
    });
  });

  /*
  curl --request POST \
    --url http://127.0.0.1:3000/api/auth/users \
    --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibWF0dGVvLmNvbGxpbmEiLCJwYXNzd29yZCI6IiQyYiQxMCRUZDRRYUJzYWc2ak1mSjdpVllPS2Z1enVncTJDOXVoVGc1bXZnOHFtRDNwSmo5Rzd5VUwveSIsImlhdCI6MTY2NjkyMjY2OCwiZXhwIjoxNjY2OTgwMjY4fQ.Fkvc0t2kNT8VuvpGbweA6ZErPCJD85kHIgHryyC0W5M" \
    --header 'content-type: application/json' \
    --data '{}' | json_pp
  */
  router.post('/users', { onRequest: [auth] }, async (req, reply) => {
    const cond = {};

    const result = await users
      ?.find(cond)
      // .sort(field, order)
      // .limit(rows)
      // .skip(rows * (page - 1))
      .toArray();

    const total = await users?.countDocuments(cond);

    return reply.send({ message: 'Hi!', result: result || [], total: total || 0 });
  });

  app.register(import('./otp/registry'), { prefix: '/otp' });
};
