import type { Processor, WorkerOptions } from 'bullmq';
import { Worker } from 'bullmq';

import redisInstance from '~/utilities/redisInstance';

export default (name = 'default', processor: Processor, options?: Partial<WorkerOptions>) => {
  const worker = new Worker(name, processor, {
    connection: redisInstance as WorkerOptions['connection'],
    ...options,
  });

  return worker;
};
