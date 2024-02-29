import { Type } from '@sinclair/typebox';

export const body = Type.Object({
  title: Type.String(),
  filter: Type.Optional(Type.Number()),
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

export const entity = Type.Object({
  _id: Type.String(),
  title: Type.String(),
  completed: Type.Boolean(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});
