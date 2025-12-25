import type { Static } from 'typebox';

import type { entity } from './schema';

export type TodoItem = Static<typeof entity>;
