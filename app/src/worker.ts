import useWorker from '~/composables/useWorker.ts';

import '~/jobs/repeatable.ts';

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
