import stream from 'node:stream';
import util from 'node:util';
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

const pipeline = util.promisify(stream.pipeline);

export default (async (app) => {
  /*
  $ curl --request POST \
         --header "Content-Type: multipart/form-data" \
         --form "image=@/Users/path/to/name.png" \
         --url http://127.0.0.1:3000/api/file-uploads
  */
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

      if (process.env.NODE_ENV === 'production') {
        await pipeline(
          data.file,
          app.cloudinary.uploader.upload_stream({ public_id: data.fieldname }),
        );
      } else {
        console.log('data =', data);
      }

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
