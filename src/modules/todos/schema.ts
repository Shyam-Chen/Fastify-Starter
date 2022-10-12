import { Static, Type } from '@sinclair/typebox';

export const TodoItem = Type.Object({
  title: Type.String(),
  completed: Type.Optional(Type.Boolean()),
});

export const TodoId = Type.Object({
  id: Type.String(),
});

export type TodoItemType = Static<typeof TodoItem>;
export type TodoIdType = Static<typeof TodoId>;
