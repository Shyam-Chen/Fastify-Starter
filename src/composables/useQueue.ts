import type { QueueOptions } from 'bullmq';
import { Queue } from 'bullmq';

import redisInstance from '~/utilities/redisInstance';

export default (name = 'default', options?: QueueOptions) => {
  const queue = new Queue(name, {
    connection: redisInstance,
    ...options,
  });

  return queue;
};
