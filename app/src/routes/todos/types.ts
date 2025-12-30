import type { Static } from 'typebox';

import type { entity } from './schema.ts';

export type TodoItem = Static<typeof entity>;
