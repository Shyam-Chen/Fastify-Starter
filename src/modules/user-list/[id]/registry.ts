import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type, Static } from '@sinclair/typebox';
import generatePassword from 'generate-password';
import bcrypt from 'bcrypt';
// import nunjucks from 'nunjucks';

import useMailer from '~/composables/useMailer';
import auth from '~/middleware/auth';
// import accountOpening from '~/templates/accountOpening.html?raw';

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
      const hashedPassword = await bcrypt.hash(password, 10);

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

  const UserBox = Type.Object({
    _id: Type.String(),
    username: Type.String(),
    email: Type.String({ format: 'email' }),
    fullName: Type.String(),
    status: Type.Boolean(),
    otpEnabled: Type.Boolean(),
    otpVerified: Type.Boolean(),
  });

  const RoleBox = Type.Object({
    role: Type.String(),
    permissions: Type.Array(Type.Any()),
  });

  router.get(
    '/',
    {
      onRequest: [auth],
      schema: {
        params: Type.Object({ id: Type.String() }),
        response: {
          200: Type.Object({
            message: Type.String(),
            result: Type.Intersect([Type.Partial(UserBox), Type.Partial(RoleBox)]),
          }),
        },
      },
    },
    async (req, reply) => {
      const users = app.mongo.db?.collection('users');
      const roles = app.mongo.db?.collection('roles');

      const user = await users?.findOne<Static<typeof UserBox>>(
        { _id: { $eq: new app.mongo.ObjectId(req.params.id) } },
        { projection: { password: 0, secret: 0 } },
      );

      const role = await roles?.findOne<Static<typeof RoleBox>>(
        { userId: { $ref: 'users', $id: user?._id } },
        { projection: { role: 1, permissions: 1 } },
      );

      return reply.send({ message: 'Hi!', result: { ...user, ...role } });
    },
  );

  router.put(
    '/',
    {
      onRequest: [auth],
      schema: {
        params: Type.Object({ id: Type.String() }),
        body: UserBox,
        response: {
          200: Type.Object({
            message: Type.String(),
          }),
        },
      },
    },
    async (req, reply) => {
      const users = app.mongo.db?.collection('users');

      await users?.updateOne(
        { _id: { $eq: new app.mongo.ObjectId(req.params.id) } },
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            fullName: req.body.fullName,
            status: req.body.status,
            otpEnabled: req.body.otpEnabled,
            otpVerified: req.body.otpVerified,
            updatedAt: new Date().toISOString(),
          },
        },
      );

      return reply.send({
        message: 'Hi!',
      });
    },
  );
};
