/**
 * Bull
 */

import useWorker from '~/composables/useWorker';

useWorker(
  'Paint',
  async (job) => {
    console.log('[Paint] Starting job:', job.name);
    console.log(job.id, job.name, job.data);
    console.log('[Paint] Finished job:', job.name);
    return;
  },
  {
    removeOnComplete: { count: 0 },
    removeOnFail: { count: 0 },
  },
);

/**
 * Bree
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Bree from 'bree';

(async () => {
  const bree = new Bree({
    root: join(dirname(fileURLToPath(import.meta.url)), 'jobs'),
    jobs: [{ name: 'hello' }],
  });

  await bree.start();
})();
