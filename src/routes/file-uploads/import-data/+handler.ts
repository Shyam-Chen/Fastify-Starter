import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import type { Row } from 'exceljs';
import exceljs from 'exceljs';

export default (async (app) => {
  app.post('', async (req, reply) => {
    const data = await req.file();

    if (!data) return reply.badRequest();

    const workbook = new exceljs.Workbook();
    const xlsx = await workbook.xlsx.read(data.file);

    const worksheet = xlsx.worksheets[0];

    const result = [] as Row['values'][];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        result.push(row.values);
      }
    });

    return reply.send({ message: 'OK', result });
  });
}) as FastifyPluginAsyncTypebox;
