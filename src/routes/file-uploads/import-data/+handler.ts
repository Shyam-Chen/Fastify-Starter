import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import { read } from 'xlsx';

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();

  router.post('', async (req, reply) => {
    const data = await req.file();
    const buffer = await data?.toBuffer();
    const workbook = read(buffer);

    return reply.send({ message: 'OK', sheets: workbook.Sheets });
  });
};
