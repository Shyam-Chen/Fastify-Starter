import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Static, Type } from '@sinclair/typebox';
import { randomUUID } from 'crypto';
import pbkdf2 from 'pbkdf2-passworder';
import { authenticator, totp } from 'otplib';
import generatePassword from 'generate-password';

import useMailer from '~/composables/useMailer';
import auth from '~/middleware/auth';

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

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();
  const users = app.mongo.db?.collection('users');
  const roles = app.mongo.db?.collection('roles');
  const sessions = app.mongo.db?.collection('sessions');

  /*
  User List -> Create a User

  curl --request POST \
    --url http://127.0.0.1:3000/api/auth/sign-up \
    --header 'content-type: application/json' \
    --data '{
      "username": "shyam.chen",
      "password": "12345678",
      "email": "shyam.chen@example.com",
      "fullName": "Shyam Chen"
    }'
  */
  router.post('/sign-up', async (req, reply) => {
    const { username, fullName, password, email } = req.body as any;

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

    return reply.send({ message: 'Hi!' });
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
        message: 'Hi!',
        accessToken: null,
        refreshToken: null,
        otpEnabled: true,
        otpVerified: true,
      });
    }

    const uuid = randomUUID();
    const accessToken = app.jwt.sign({ username, uuid }, { expiresIn: '20m' });
    const refreshToken = app.jwt.sign({ uuid }, { expiresIn: '12h' });

    return reply.send({
      message: 'Hi!',
      accessToken,
      refreshToken,
      otpEnabled: user.otpEnabled,
      otpVerified: user.otpVerified,
    });
  });

  /*
  curl --request POST \
    --url http://127.0.0.1:3000/api/auth/token \
    --header 'content-type: application/json' \
    --data '{ "accessToken": "xxx", "refreshToken": "xxx" }'
  */
  router.post('/token', async (req, reply) => {
    const { accessToken, refreshToken } = req.body as any;

    const decodedAccessToken = app.jwt.decode(accessToken) as any;
    const decodedRefreshToken = app.jwt.decode(refreshToken) as any;

    if (decodedAccessToken.uuid === decodedRefreshToken.uuid) {
      const accessToken = app.jwt.sign(
        { username: decodedAccessToken.username, uuid: decodedAccessToken.uuid },
        { expiresIn: '20m' },
      );

      return reply.send({ message: 'Hi!', accessToken });
    }

    return reply.badRequest();
  });

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/auth/user

  curl --request GET \
    --url http://127.0.0.1:3000/api/auth/user \
    --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibWF0dGVvLmNvbGxpbmEiLCJwYXNzd29yZCI6IiQyYiQxMCRUZDRRYUJzYWc2ak1mSjdpVllPS2Z1enVncTJDOXVoVGc1bXZnOHFtRDNwSmo5Rzd5VUwveSIsImlhdCI6MTY2NjkyMjY2OCwiZXhwIjoxNjY2OTgwMjY4fQ.Fkvc0t2kNT8VuvpGbweA6ZErPCJD85kHIgHryyC0W5M"
  */
  router.get('/user', { onRequest: [auth] }, async (req, reply) => {
    const user = await users?.findOne(
      { username: { $eq: req.user.username } },
      { projection: { password: 0, secret: 0 } },
    );

    const role = await roles?.findOne(
      { userId: { $ref: 'users', $id: user?._id } },
      { projection: { role: 1, permissions: 1 } },
    );

    return reply.send({ message: 'Hi!', ...user, ...role });
  });

  /*
  curl --request POST \
    --url http://127.0.0.1:3000/api/auth/reset-password/send \
    --header 'content-type: application/json' \
    --data '{ "email": "shyam.chen@example.com" }'
  */
  router.post('/reset-password/send', async (req, reply) => {
    const { email } = req.body as any;

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

    return reply.send({ message: 'Hi!', messageId: info.messageId });
  });

  /*
  curl --request POST \
    --url http://127.0.0.1:3000/api/auth/reset-password/validate \
    --header 'content-type: application/json' \
    --data '{ "code": "325198", "messageId": "xxx", "email": "shyam.chen@example.com" }'
  */
  router.post('/reset-password/validate', async (req, reply) => {
    const { code, messageId, email } = req.body as any;

    const session = await sessions?.findOne({ messageId: { $eq: messageId } });

    const isValid = totp.check(code, session?.secret);
    if (!isValid) return reply.badRequest();

    if (email !== session?.email) return reply.badRequest();

    const password = generatePassword.generate({ numbers: true });
    const hashedPassword = await pbkdf2.hash(password);
    await users?.findOneAndUpdate({ email: { $eq: session?.email } }, { password: hashedPassword });

    return reply.send({ message: 'Hi!', password });
  });

  /*
  curl --request POST \
    --url http://127.0.0.1:3000/api/auth/reset-password/change \
    --header 'content-type: application/json' \
    --header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoibWF0dGVvLmNvbGxpbmEiLCJwYXNzd29yZCI6IiQyYiQxMCRUZDRRYUJzYWc2ak1mSjdpVllPS2Z1enVncTJDOXVoVGc1bXZnOHFtRDNwSmo5Rzd5VUwveSIsImlhdCI6MTY2NjkyMjY2OCwiZXhwIjoxNjY2OTgwMjY4fQ.Fkvc0t2kNT8VuvpGbweA6ZErPCJD85kHIgHryyC0W5M" \
    --data '{ "password": "qwerty123", "confirmPassword": "qwerty123" }'
  */
  router.post('/reset-password/change', { onRequest: [auth] }, async (req, reply) => {
    const { password, confirmPassword } = req.body as any;

    if (password.trim() !== confirmPassword.trim()) return reply.badRequest();

    return reply.send({ message: 'Hi!' });
  });

  app.register(import('./otp/registry'), { prefix: '/otp' });
};
