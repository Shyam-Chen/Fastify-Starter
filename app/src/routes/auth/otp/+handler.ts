import { randomUUID } from 'node:crypto';
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from 'typebox';
import { authenticator } from 'otplib';
import pbkdf2 from 'pbkdf2-passworder';

import auth from '~/middleware/auth';

import authService from '../service';

export default (async (app) => {
  const users = app.mongo.db?.collection('users');

  /*
  $ curl --request GET \
         --url http://127.0.0.1:3000/api/auth/otp/setup \
         --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibWF0dGVvLmNvbGxpbmEiLCJwYXNzd29yZCI6IiQyYiQxMCRUZDRRYUJzYWc2ak1mSjdpVllPS2Z1enVncTJDOXVoVGc1bXZnOHFtRDNwSmo5Rzd5VUwveSIsImlhdCI6MTY2NjkyMjY2OCwiZXhwIjoxNjY2OTgwMjY4fQ.Fkvc0t2kNT8VuvpGbweA6ZErPCJD85kHIgHryyC0W5M"
  */
  app.get('/setup', { onRequest: [auth] }, async (req, reply) => {
    const user = await users?.findOne({ username: { $eq: req.user.username } });

    const secret = authenticator.generateSecret();

    await users?.updateOne(
      { _id: { $eq: new app.mongo.ObjectId(user?._id) } },
      { $set: { secret, otpEnabled: true } },
    );

    const url = authenticator.keyuri(user?.username, 'Fastify Starter', secret);
    return reply.send({ message: 'OK', url });
  });

  /*
  $ curl --request POST \
         --url http://127.0.0.1:3000/api/auth/otp/verify \
         --header 'Content-Type: application/json' \
         --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibWF0dGVvLmNvbGxpbmEiLCJwYXNzd29yZCI6IiQyYiQxMCRUZDRRYUJzYWc2ak1mSjdpVllPS2Z1enVncTJDOXVoVGc1bXZnOHFtRDNwSmo5Rzd5VUwveSIsImlhdCI6MTY2NjkyMjY2OCwiZXhwIjoxNjY2OTgwMjY4fQ.Fkvc0t2kNT8VuvpGbweA6ZErPCJD85kHIgHryyC0W5M" \
         --data '{ "code": "469457" }'
  */
  app.post(
    '/verify',
    {
      onRequest: [auth],
      schema: {
        body: Type.Object({
          code: Type.String({ minLength: 6, maxLength: 6 }),
        }),
      },
    },
    async (req, reply) => {
      const { code } = req.body;

      const user = await users?.findOne({ username: { $eq: req.user.username } });

      const isValid = authenticator.check(code, user?.secret);
      if (!isValid) return reply.badRequest();

      await users?.updateOne(
        { _id: { $eq: new app.mongo.ObjectId(user?._id) } },
        { $set: { otpVerified: true } },
      );

      return reply.send({ message: 'OK', isValid });
    },
  );

  /*
  $ curl --request POST \
         --url http://127.0.0.1:3000/api/auth/otp/validate \
         --header 'Content-Type: application/json' \
         --data '{ "code": "469457", "username": "shyam.chen", "password": "12345678" }'
  */
  app.post(
    '/validate',
    {
      schema: {
        body: Type.Object({
          username: Type.String(),
          password: Type.String(),
          code: Type.String({ minLength: 6, maxLength: 6 }),
        }),
      },
    },
    async (req, reply) => {
      const { code, username, password } = req.body;

      const user = await users?.findOne({ username: { $eq: username } });

      const isMatch = await pbkdf2.compare(password, user?.password);
      if (!isMatch) return reply.badRequest();

      const isValid = authenticator.check(code, user?.secret);
      if (!isValid) return reply.badRequest();

      const uuid = randomUUID();
      const { accessToken, refreshToken } = await authService.signToken(app, { username, uuid });

      return reply.send({ message: 'OK', accessToken, refreshToken });
    },
  );
}) as FastifyPluginAsyncTypebox;
