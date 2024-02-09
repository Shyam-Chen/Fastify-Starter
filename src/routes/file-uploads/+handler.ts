import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import stream from 'stream';
import util from 'util';

const pipeline = util.promisify(stream.pipeline);

export default (async (app) => {
  app.post('', async (req, reply) => {
    const data = await req.file();

    if (data) {
      await pipeline(
        data.file,
        app.cloudinary.uploader.upload_stream({ public_id: data.fieldname }),
      );

      return reply.send({ message: 'hi', url: app.cloudinary.url(data.fieldname) });
    }

    return reply.badRequest();
  });

  app.get('', async (req, reply) => {
    return reply.send({ url: app.cloudinary.url('userfile') });
  });
}) as FastifyPluginAsyncTypebox;
