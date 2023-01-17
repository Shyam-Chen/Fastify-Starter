import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import generatePassword from 'generate-password';

import useMailer from '~/composables/useMailer';
import auth from '~/middleware/auth';

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();

  router.post(
    '/',
    {
      onRequest: [auth],
      schema: {
        params: Type.Object({ id: Type.Literal('new') }),
        body: Type.Object({
          username: Type.String(),
          email: Type.String({ format: 'email' }),
          fullName: Type.String(),
        }),
        response: { 200: Type.Object({ message: Type.String() }) },
      },
    },
    async (req, reply) => {
      const { username, email, fullName } = req.body;

      const users = app.mongo.db?.collection('users');
      const roles = app.mongo.db?.collection('roles');

      const user = await users?.findOne({ username: { $eq: username } });
      if (user) return reply.badRequest('#username That username is taken. Try another.');

      const userId = new app.mongo.ObjectId();
      const password = generatePassword.generate({ numbers: true });

      await users?.insertOne({
        _id: userId,
        username,
        password,
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
        role: 'user',
        permissions: [{ resource: '', action: '' }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const mailer = useMailer();

      await mailer.sendMail({
        to: email,
        subject: `[Platform] Account Opening - ${fullName}`,
        // html: nunjucks.renderString(accountOpening, { username, password }),
        text: password,
      });

      return reply.send({ message: 'Hi!' });
    },
  );

  router.get(
    '/',
    {
      onRequest: [auth],
      schema: {
        params: Type.Object({ id: Type.String() }),
      },
    },
    async (req, reply) => {
      const users = app.mongo.db?.collection('users');

      const result = await users?.findOne(
        { _id: { $eq: new app.mongo.ObjectId(req.params.id) } },
        { projection: { password: 0, secret: 0 } },
      );

      return reply.send({ message: 'Hi!', result: result || {} });
    },
  );

  router.put(
    '/',
    {
      onRequest: [auth],
      schema: {
        params: Type.Object({ id: Type.String() }),
      },
    },
    async (req, reply) => {
      return reply.send({
        message: 'Hi!',
      });
    },
  );

  router.delete(
    '/',
    {
      onRequest: [auth],
      schema: {
        params: Type.Object({ id: Type.String() }),
      },
    },
    async (req, reply) => {
      return reply.send({
        message: 'Hi!',
      });
    },
  );
};
