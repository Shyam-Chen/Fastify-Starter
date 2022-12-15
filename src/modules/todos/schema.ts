import { Type } from '@sinclair/typebox';

export const body = Type.Object({
  title: Type.String(),
  completed: Type.Optional(Type.Boolean()),
});

export const behavior = Type.Object({
  field: Type.Optional(Type.String()),
  order: Type.Optional(Type.Union([Type.Literal('asc'), Type.Literal('desc')])),
  page: Type.Optional(Type.String()),
  rows: Type.Optional(Type.String()),
});

export const params = Type.Object({
  id: Type.String(),
});

export const message = Type.String();

export const entity = Type.Intersect([
  Type.Required(body),
  Type.Object({
    _id: Type.String(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
  }),
]);
