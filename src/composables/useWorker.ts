import type { Processor, WorkerOptions } from 'bullmq';
import { Worker } from 'bullmq';

import redisInstance from '~/utilities/redisInstance';

export default (name = 'default', processor: Processor, options?: WorkerOptions) => {
  const worker = new Worker(name, processor, {
    connection: redisInstance,
    ...options,
  });

  return worker;
};
