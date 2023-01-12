import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { authenticator } from 'otplib';

import auth from '~/middleware/auth';

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();
  const users = app.mongo.db?.collection('users');

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/auth/otp/setup \
    --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibWF0dGVvLmNvbGxpbmEiLCJwYXNzd29yZCI6IiQyYiQxMCRUZDRRYUJzYWc2ak1mSjdpVllPS2Z1enVncTJDOXVoVGc1bXZnOHFtRDNwSmo5Rzd5VUwveSIsImlhdCI6MTY2NjkyMjY2OCwiZXhwIjoxNjY2OTgwMjY4fQ.Fkvc0t2kNT8VuvpGbweA6ZErPCJD85kHIgHryyC0W5M"
  */
  router.get('/setup', { onRequest: [auth] }, async (req, reply) => {
    const user = await users?.findOne({ username: { $eq: req.user.username } });

    const secret = authenticator.generateSecret();

    await users?.updateOne(
      { _id: { $eq: new app.mongo.ObjectId(user?._id) } },
      { $set: { secret, otpEnabled: true } },
    );

    const url = authenticator.keyuri(user?.username, 'Fastify Starter', secret);
    return reply.send({ message: 'Hi!', url });
  });

  /*
  curl --request POST \
    --url http://127.0.0.1:3000/api/auth/otp/verify \
    --header 'Content-Type: application/json' \
    --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibWF0dGVvLmNvbGxpbmEiLCJwYXNzd29yZCI6IiQyYiQxMCRUZDRRYUJzYWc2ak1mSjdpVllPS2Z1enVncTJDOXVoVGc1bXZnOHFtRDNwSmo5Rzd5VUwveSIsImlhdCI6MTY2NjkyMjY2OCwiZXhwIjoxNjY2OTgwMjY4fQ.Fkvc0t2kNT8VuvpGbweA6ZErPCJD85kHIgHryyC0W5M" \
    --data '{ "code": "469457" }'
  */
  router.post('/verify', { onRequest: [auth] }, async (req, reply) => {
    const { code } = req.body as any;

    const user = await users?.findOne({ username: { $eq: req.user.username } });

    const isValid = authenticator.check(code, user?.secret);
    if (!isValid) return reply.badRequest();

    await users?.updateOne(
      { _id: { $eq: new app.mongo.ObjectId(user?._id) } },
      { $set: { otpVerified: true } },
    );

    return reply.send({ message: 'Hi!', isValid });
  });

  /*
  curl --request POST \
    --url http://127.0.0.1:3000/api/auth/otp/validate \
    --header 'Content-Type: application/json' \
    --data '{ "code": "469457", "username": "shyam.chen" }'
  */
  router.post('/validate', async (req, reply) => {
    const { code, username } = req.body as any;

    const user = await users?.findOne({ username: { $eq: username } });

    const isValid = authenticator.check(code, user?.secret);
    if (!isValid) return reply.badRequest();

    const token = app.jwt.sign(
      { username, password: user?.password, email: user?.email },
      { expiresIn: '12h' },
    );

    return reply.send({ message: 'Hi!', token });
  });
};
