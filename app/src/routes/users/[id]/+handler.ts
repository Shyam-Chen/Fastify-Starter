import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { type Static, Type } from '@sinclair/typebox';
import generatePassword from 'generate-password';
import pbkdf2 from 'pbkdf2-passworder';
// import nunjucks from 'nunjucks';

// import useMailer from '~/composables/useMailer';
// import accountOpening from '~/templates/accountOpening.html?raw';

import { RoleBox, UserBox } from '../schema';

export default (async (app) => {
  app.post(
    '',
    {
      schema: {
        params: Type.Object({ id: Type.Literal('new') }),
        body: Type.Object({
          username: Type.String(),
          email: Type.String({ format: 'email' }),
          fullName: Type.String(),
          role: Type.Union([
            Type.Literal('viewer'),
            Type.Literal('editor'),
            Type.Literal('admin'),
            Type.Literal('custom'),
          ]),
          permissions: Type.Array(
            Type.Recursive((Self) =>
              Type.Object({
                resource: Type.String(),
                operations: Type.Array(Type.String()),
                children: Type.Optional(Type.Array(Self)),
              }),
            ),
          ),
        }),
        response: { 200: Type.Object({ message: Type.String() }) },
      },
    },
    async (req, reply) => {
      const { username, email, fullName, role, permissions } = req.body;

      const users = app.mongo.db?.collection('users');
      const roles = app.mongo.db?.collection('roles');

      const user = await users?.findOne({ username: { $eq: username } });
      if (user) return reply.badRequest('#username That username is taken. Try another.');

      const userId = new app.mongo.ObjectId();
      const password = generatePassword.generate({ numbers: true });
      const hashedPassword = await pbkdf2.hash(password);

      const now = new Date().toISOString();

      const results = await Promise.allSettled([
        users?.insertOne({
          _id: userId,
          username,
          password: hashedPassword,
          email,
          fullName,
          role,
          permissions,
          status: true,

          secret: null,
          otpEnabled: false,
          otpVerified: false,

          createdAt: now,
          updatedAt: now,
        }),
        roles?.insertOne({
          userId: { $ref: 'users', $id: userId },
          role,
          permissions,
          createdAt: now,
          updatedAt: now,
        }),
      ]);

      if (results[0].status === 'rejected' && results[1].status === 'fulfilled') {
        await roles?.deleteOne({ 'userId.$id': { $eq: userId } });
      }

      if (results[0].status === 'fulfilled' && results[1].status === 'rejected') {
        await users?.deleteOne({ _id: { $eq: userId } });
      }

      // const mailer = useMailer();

      // await mailer.sendMail({
      //   to: email,
      //   subject: `[Platform] Account Opening - ${fullName}`,
      //   // html: nunjucks.renderString(accountOpening, { username, password }),
      //   text: password,
      // });

      return reply.send({ message: 'OK' });
    },
  );

  app.get(
    '',
    {
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

      return reply.send({ message: 'OK', result: { ...user, ...role } });
    },
  );

  app.put(
    '',
    {
      schema: {
        params: Type.Object({ id: Type.String() }),
        body: UserBox,
        response: {
          200: Type.Object({ message: Type.String() }),
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

      return reply.send({ message: 'OK' });
    },
  );

  app.delete(
    '',
    {
      schema: {
        params: Type.Object({ id: Type.String() }),
        response: {
          200: Type.Object({ message: Type.String() }),
        },
      },
    },
    async (request, reply) => {
      const users = app.mongo.db?.collection('users');
      await users?.deleteOne({ _id: { $eq: new app.mongo.ObjectId(request.params.id) } });
      return reply.send({ message: 'OK' });
    },
  );
}) as FastifyPluginAsyncTypebox;
