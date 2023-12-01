import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { Row } from 'exceljs';
import { Workbook } from 'exceljs';

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();

  router.post('', async (req, reply) => {
    const data = await req.file();

    if (!data) return reply.badRequest();

    const workbook = new Workbook();
    const xlsx = await workbook.xlsx.read(data.file);

    const worksheet = xlsx.worksheets[0];

    const result = [] as Row['values'][];

    worksheet.eachRow(function (row, rowNumber) {
      if (rowNumber > 1) {
        result.push(row.values);
      }
    });

    return reply.send({ message: 'OK', result });
  });
};
