import type { Static } from '@sinclair/typebox';

import type { entity } from './schema';

export type TodoItem = Static<typeof entity>;
