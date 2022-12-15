import { Static } from '@sinclair/typebox';

import { entity } from './schema';

export type TodoItem = Static<typeof entity>;
