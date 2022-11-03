import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import stream from 'stream';
import util from 'util';
import { read } from 'xlsx';

const pipeline = util.promisify(stream.pipeline);

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();

  router.post('/file-uploads', async (req, reply) => {
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

  router.get('/file-uploads', async (req, reply) => {
    return reply.send({ url: app.cloudinary.url('userfile') });
  });

  router.post('/import-data', async (req, reply) => {
    const data = await req.file();
    const buffer = await data?.toBuffer();
    const workbook = read(buffer);

    return reply.send({ message: 'Hi!', sheets: workbook.Sheets });
  });
};
