import { randomUUID } from 'node:crypto';
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import generatePassword from 'generate-password';
import { authenticator, totp } from 'otplib';
import pbkdf2 from 'pbkdf2-passworder';
import { type Static, Type } from 'typebox';

import useMailer from '~/composables/useMailer.ts';
import auth from '~/middleware/auth.ts';

import service from './service.ts';

const body = Type.Object({
  username: Type.String(),
  fullName: Type.String(),
  password: Type.String(),
  email: Type.String({ format: 'email' }),
});

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { username?: string; uuid: string };
    user: Omit<Static<typeof body>, 'password'>;
  }
}

export default (async (app) => {
  const users = app.mongo.db?.collection('users');
  const roles = app.mongo.db?.collection('roles');
  const sessions = app.mongo.db?.collection('sessions');

  /*
  User List -> Create a User

  $ curl --request POST \
         --url http://127.0.0.1:3000/api/auth/sign-up \
         --header 'content-type: application/json' \
         --data '{
                   "username": "shyam.chen",
                   "password": "12345678",
                   "email": "shyam.chen@example.com",
                   "fullName": "Shyam Chen"
                 }'
  */
  app.post(
    '/sign-up',
    {
      schema: {
        body: Type.Object({
          username: Type.String(),
          password: Type.String(),
          email: Type.String(),
          fullName: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const { username, password, email, fullName } = request.body;

      const user = await users?.findOne({ username: { $eq: username } });
      if (user) return reply.badRequest('#username That username is taken. Try another.');

      const hashedPassword = await pbkdf2.hash(password);

      const userId = new app.mongo.ObjectId();

      await users?.insertOne({
        _id: userId,
        username,
        password: hashedPassword,
        email,
        fullName,
        status: true,

        secret: null,
        otpEnabled: false,
        otpVerified: false,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      await roles?.insertOne({
        userId: { $ref: 'users', $id: userId },
        role: 'admin',
        permissions: [{ resource: '*', action: '*' }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return reply.send({ message: 'OK' });
    },
  );

  /*
  $ curl --request POST \
         --url http://127.0.0.1:3000/api/auth/sign-in \
         --header 'content-type: application/json' \
         --data '{ "username": "shyam.chen", "password": "12345678" }'
  */
  app.post(
    '/sign-in',
    {
      schema: {
        body: Type.Object({
          username: Type.String(),
          password: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const { username, password } = request.body;

      const user = await users?.findOne({ username: { $eq: username } });
      if (!user) return reply.badRequest(`#username Couldn't find your account.`);

      try {
        const isMatch = await pbkdf2.compare(password, user.password);
        if (!isMatch) throw Error('Unexpected property.');
      } catch {
        return reply.badRequest(
          '#password Wrong password. Try again or click Forgot password to reset it.',
        );
      }

      if (user.otpEnabled && user.otpVerified) {
        return reply.send({
          message: 'OK',
          accessToken: null,
          refreshToken: null,
          otpEnabled: true,
          otpVerified: true,
        });
      }

      const uuid = randomUUID();
      const { accessToken, refreshToken } = await service.signToken(app, { username, uuid });

      return reply.send({
        message: 'OK',
        accessToken,
        refreshToken,
        otpEnabled: user.otpEnabled,
        otpVerified: user.otpVerified,
      });
    },
  );

  /*
  $ curl --request POST \
         --url http://127.0.0.1:3000/api/auth/token \
         --header 'content-type: application/json' \
         --data '{ "accessToken": "xxx", "refreshToken": "xxx" }'
  */
  app.post(
    '/token',
    {
      schema: {
        body: Type.Object({
          accessToken: Type.String(),
          refreshToken: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const { accessToken, refreshToken } = request.body;

      const decodedAccessToken = app.jwt.decode<{ uuid: string; username: string }>(accessToken);
      const decodedRefreshToken = app.jwt.decode<{ uuid: string }>(refreshToken);

      if (decodedAccessToken?.uuid === decodedRefreshToken?.uuid) {
        if (decodedAccessToken?.uuid) {
          const username = decodedAccessToken.username;
          const uuid = decodedAccessToken.uuid;
          const originalRefreshToken = await app.redis.get(`${username}+${uuid}`);

          if (originalRefreshToken === refreshToken) {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
              await service.signToken(app, { username, uuid });

            return reply.send({
              message: 'OK',
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            });
          }
        }
      }

      return reply.badRequest();
    },
  );

  /*
  Log out of all devices.

  ```sh
  $ curl --request GET \
         --url http://127.0.0.1:3000/api/auth/revoke
  ```
  */
  app.get('/revoke', { onRequest: [auth] }, async (request, reply) => {
    const keys = await app.redis.keys(`${request.user.username}+*`);
    if (keys?.length) await app.redis.del(...keys);
    return reply.send({ message: 'OK' });
  });

  /*
  $ curl --request GET \
         --url http://127.0.0.1:3000/api/auth/user

  $ curl --request GET \
         --url http://127.0.0.1:3000/api/auth/user \
         --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibWF0dGVvLmNvbGxpbmEiLCJwYXNzd29yZCI6IiQyYiQxMCRUZDRRYUJzYWc2ak1mSjdpVllPS2Z1enVncTJDOXVoVGc1bXZnOHFtRDNwSmo5Rzd5VUwveSIsImlhdCI6MTY2NjkyMjY2OCwiZXhwIjoxNjY2OTgwMjY4fQ.Fkvc0t2kNT8VuvpGbweA6ZErPCJD85kHIgHryyC0W5M"
  */
  app.get('/user', { onRequest: [auth] }, async (request, reply) => {
    const user = await users?.findOne(
      { username: { $eq: request.user.username } },
      { projection: { password: 0, secret: 0 } },
    );

    const role = await roles?.findOne(
      { userId: { $ref: 'users', $id: user?._id } },
      { projection: { role: 1, permissions: 1 } },
    );

    return reply.send({ message: 'OK', ...user, ...role });
  });

  /*
  $ curl --request POST \
         --url http://127.0.0.1:3000/api/auth/reset-password/send \
         --header 'content-type: application/json' \
         --data '{ "email": "shyam.chen@example.com" }'
  */
  app.post(
    '/reset-password/send',
    {
      schema: {
        body: Type.Object({
          email: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      const mailer = useMailer();

      const secret = authenticator.generateSecret();
      const token = totp.generate(secret);

      const info = await mailer.sendMail({
        to: email,
        subject: 'Hello ✔',
        text: token,
      });

      sessions?.insertOne({
        messageId: info.messageId,
        email,
        secret,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return reply.send({ message: 'OK', messageId: info.messageId });
    },
  );

  /*
  $ curl --request POST \
         --url http://127.0.0.1:3000/api/auth/reset-password/validate \
         --header 'content-type: application/json' \
         --data '{ "code": "325198", "messageId": "xxx", "email": "shyam.chen@example.com" }'
  */
  app.post(
    '/reset-password/validate',
    {
      schema: {
        body: Type.Object({
          code: Type.String(),
          messageId: Type.String(),
          email: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const { code, messageId, email } = request.body;

      const session = await sessions?.findOne({ messageId: { $eq: messageId } });

      const isValid = totp.check(code, session?.secret);
      if (!isValid) return reply.badRequest();

      if (email !== session?.email) return reply.badRequest();

      const password = generatePassword.generate({ numbers: true });
      const hashedPassword = await pbkdf2.hash(password);
      await users?.findOneAndUpdate(
        { email: { $eq: session?.email } },
        { password: hashedPassword },
      );

      return reply.send({ message: 'OK', password });
    },
  );

  /*
  $ curl --request POST \
         --url http://127.0.0.1:3000/api/auth/reset-password/change \
         --header 'content-type: application/json' \
         --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibWF0dGVvLmNvbGxpbmEiLCJwYXNzd29yZCI6IiQyYiQxMCRUZDRRYUJzYWc2ak1mSjdpVllPS2Z1enVncTJDOXVoVGc1bXZnOHFtRDNwSmo5Rzd5VUwveSIsImlhdCI6MTY2NjkyMjY2OCwiZXhwIjoxNjY2OTgwMjY4fQ.Fkvc0t2kNT8VuvpGbweA6ZErPCJD85kHIgHryyC0W5M" \
         --data '{ "password": "qwerty123", "confirmPassword": "qwerty123" }'
  */
  app.post(
    '/reset-password/change',
    {
      onRequest: [auth],
      schema: {
        body: Type.Object({
          password: Type.String(),
          confirmPassword: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const { password, confirmPassword } = request.body;

      if (password.trim() !== confirmPassword.trim()) return reply.badRequest();

      return reply.send({ message: 'OK' });
    },
  );
}) as FastifyPluginAsyncTypebox;
