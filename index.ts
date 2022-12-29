import { dirname } from 'path';
import { fileURLToPath } from 'url';
import pm2 from 'pm2';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

pm2.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  pm2.start(
    {
      name: 'fastify-starter',
      script: `${__dirname}/main.mjs`,
      max_memory_restart: process.env.SERVICE_MEMORY || '1G',
      exec_mode: 'cluster',
      instances: Number(process.env.SERVICE_CONCURRENCY) || -1,
    },
    (err) => {
      if (err) {
        console.error(err);
        return pm2.disconnect();
      }

      console.log('PM2 and application has been succesfully started.');
    },
  );
});
