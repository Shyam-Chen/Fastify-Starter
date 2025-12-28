import type { QueueOptions } from 'bullmq';
import { Queue } from 'bullmq';

import redisInstance from '~/utilities/redisInstance.ts';

export default (name = 'default', options?: Partial<QueueOptions>) => {
  const queue = new Queue(name, {
    connection: redisInstance as QueueOptions['connection'],
    ...options,
  });

  return queue;
};
