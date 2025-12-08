import type { ConnectionOptions } from 'bullmq';
import { Queue, Worker } from 'bullmq';

const connection: ConnectionOptions = { url: process.env.REDIS_URL };
const jobId = 'my-repeatable-jobs';

const queue = new Queue(jobId, { connection });

// Upserting a repeatable job in the queue
await queue.upsertJobScheduler(
  'repeat-every-10s',
  {
    every: 10_000, // Job will repeat every 10,000 milliseconds (10 seconds)
  },
  {
    name: 'every-job',
    data: { jobData: 'myData' },
    opts: {}, // Optional additional job options
  },
);

// Worker to process the jobs
new Worker(
  jobId,
  async (job) => {
    console.log(`Processing job ${job.id} with data: ${job.data.jobData}`);
  },
  { connection },
);
