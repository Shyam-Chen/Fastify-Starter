import type { FastifyInstance } from 'fastify';
import stream from 'stream';
import util from 'util';

const pipeline = util.promisify(stream.pipeline);

export default async (app: FastifyInstance) => {
  app.post('/file-uploads', async (req, reply) => {
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

  app.get('/file-uploads', async (req, reply) => {
    return reply.send({ url: app.cloudinary.url('userfile') });
  });
};
