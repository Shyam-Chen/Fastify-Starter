import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from 'typebox';

import { entity, message, params } from '../schema';
import type { TodoItem } from '../types';

export default (async (app) => {
  const todos = app.mongo.db?.collection('todos');

  /*
  $ curl --request POST \
         --url http://127.0.0.1:3000/api/todos/new \
         --header 'content-type: application/json' \
         --data '{
           "title": "foo"
         }'
  */
  app.post(
    '',
    {
      schema: {
        params: Type.Object({ id: Type.Literal('new') }),
        body: Type.Object({
          title: Type.String(),
          completed: Type.Optional(Type.Boolean()),
        }),
        response: { 201: Type.Object({ message }) },
      },
    },
    async (request, reply) => {
      await todos?.insertOne({
        title: request.body.title,
        completed: request.body.completed || false,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      });

      return reply.status(201).send({ message: 'Created successfully.' });
    },
  );

  /*
  $ curl --request GET \
         --url http://127.0.0.1:3000/api/todos/634787af6d44cfba9c0df8ea
  */
  app.get(
    '',
    {
      schema: {
        params,
        response: {
          200: Type.Object({ message, result: entity }),
          404: Type.Object({ message }),
        },
      },
    },
    async (request, reply) => {
      const result = await todos?.findOne<TodoItem>({
        _id: { $eq: new app.mongo.ObjectId(request.params.id) },
      });

      if (!result) {
        return reply.status(404).send({ message: 'Document not found.' });
      }

      return reply.send({ message: 'OK', result: result });
    },
  );

  /*
  $ curl --request PUT \
         --url http://127.0.0.1:3000/api/todos/634516681a8fd0d3cd9791f1 \
         --header 'content-type: application/json' \
         --data '{
           "title": "foo",
           "completed": true
         }'
  */
  app.put(
    '',
    {
      schema: {
        params,
        body: Type.Object({
          title: Type.String(),
          completed: Type.Boolean(),

          version: Type.Number(),
        }),
        response: { 200: Type.Object({ message }) },
      },
    },
    async (request, reply) => {
      const result = await todos?.updateOne(
        {
          _id: { $eq: new app.mongo.ObjectId(request.params.id) },
          version: request.body.version,
        },
        {
          $set: {
            title: request.body.title,
            completed: request.body.completed,
            updatedAt: new Date().toISOString(),
          },
          $inc: { version: 1 },
        },
      );

      if (result?.modifiedCount === 0) {
        const docExists = await todos?.findOne({
          _id: new app.mongo.ObjectId(request.params.id),
        });

        if (docExists) {
          return reply.status(409).send({
            message: 'The document has been modified by another user. Please reload and try again.',
          });
        }

        return reply.status(404).send({ message: 'Document not found.' });
      }

      return reply.send({ message: 'Updated successfully.' });
    },
  );

  /*
  $ curl --request DELETE \
         --url http://127.0.0.1:3000/api/todos/634516681a8fd0d3cd9791f1
  */
  app.delete(
    '',
    {
      schema: {
        params,
        response: { 200: Type.Object({ message }) },
      },
    },
    async (request, reply) => {
      await todos?.deleteOne({ _id: { $eq: new app.mongo.ObjectId(request.params.id) } });
      return reply.send({ message: 'Deleted successfully.' });
    },
  );
}) as FastifyPluginAsyncTypebox;
