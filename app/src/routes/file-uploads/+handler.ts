import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

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

      const public_id = path.basename(data.filename, path.extname(data.filename));

      if (process.env.NODE_ENV === 'production') {
        await pipeline(data.file, app.cloudinary.uploader.upload_stream({ public_id }));
      } else {
        const dir = path.resolve(import.meta.dirname, '../../../dist');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        await pipeline(data.file, fs.createWriteStream(path.resolve(dir, data.filename)));
      }

      return reply.send({ message: 'OK', url: app.cloudinary.url(public_id) });
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
