import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import stream from 'stream';
import util from 'util';
import { Type } from '@sinclair/typebox';

const pipeline = util.promisify(stream.pipeline);

export default (async (app) => {
  app.post(
    '',
    {
      schema: {
        response: {
          '2xx': {
            message: Type.String(),
            url: Type.String(),
          },
        },
      },
    },
    async (req, reply) => {
      const data = await req.file();

      if (!data) return reply.badRequest();

      await pipeline(
        data.file,
        app.cloudinary.uploader.upload_stream({ public_id: data.fieldname }),
      );

      return reply.send({ message: 'OK', url: app.cloudinary.url(data.fieldname) });
    },
  );

  app.get(
    '',
    {
      schema: {
        response: {
          '2xx': {
            message: Type.String(),
            url: Type.String(),
          },
        },
      },
    },
    async (req, reply) => {
      return reply.send({ message: 'OK', url: app.cloudinary.url('userfile') });
    },
  );
}) as FastifyPluginAsyncTypebox;
