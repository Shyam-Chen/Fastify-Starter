import type { FastifyRequest } from 'fastify';
import { Type, Static } from '@sinclair/typebox';

/**
 * @example
 *
 * import usePagination, { PaginationBox } from '~/composables/usePagination';
 *
 * schema.body:
 *   Type.Intersect([Type.Partial(body), PaginationBox]),
 *
 * handler(req, reply):
 *   const { field, order, page, rows } = usePagination(req);
 */

export const PaginationBox = Type.Object({
  field: Type.Optional(Type.String()),
  order: Type.Optional(Type.Union([Type.Literal('asc'), Type.Literal('desc')])),
  page: Type.Optional(Type.String()),
  rows: Type.Optional(Type.String()),
});

export default <T extends FastifyRequest>(req: T) => {
  const body = req.body as Static<typeof PaginationBox>;

  return {
    field: body.field || 'createdAt',
    order: body.order || 'desc',
    page: Number(body.page) || 1,
    rows: Number(body.rows) || 10,
  };
};
