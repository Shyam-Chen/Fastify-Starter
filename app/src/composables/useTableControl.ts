import type { FastifyRequest } from 'fastify';
import { type Static, Type } from 'typebox';

/**
 * @example
 *
 * import useTableControl, { TableControlBox } from '~/composables/useTableControl.ts';
 *
 * schema.body:
 *   Type.Intersect([Type.Partial(body), TableControlBox]),
 *
 * handler(request, reply):
 *   const { page, rows, field, direction } = useTableControl(request);
 */

export const TableControlBox = Type.Object({
  page: Type.Optional(Type.String()),
  rows: Type.Optional(Type.String()),
  field: Type.Optional(Type.String()),
  direction: Type.Optional(Type.Union([Type.Literal('asc'), Type.Literal('desc')])),
});

export type TableControl = Static<typeof TableControlBox>;

export default <T extends FastifyRequest>(request: T) => {
  const body = request.body as TableControl;

  return {
    page: Number(body.page) || 1, // current page
    rows: Number(body.rows) || 10, // page size (rows per page: 10)
    field: body.field || 'createdAt', // sort field
    direction: body.direction || 'desc', // sort direction
  };
};
