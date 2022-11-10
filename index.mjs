import { dirname } from 'path';
import { fileURLToPath } from 'url';
import pm2 from 'pm2';

const __dirname = dirname(fileURLToPath(import.meta.url));

pm2.connect(() => {
  pm2.start(
    {
      name: 'fastify-starter',
      script: `${__dirname}/dist/main.mjs`,
      max_memory_restart: process.env.SERVICE_MEMORY || '1G',
      exec_mode: 'cluster',
      instances: process.env.SERVICE_CONCURRENCY || -1,
    },
    (err) => {
      if (err) {
        throw new Error(`Error while launching applications ${err.stack || err}.`);
      }

      console.log('PM2 and application has been succesfully started.');

      pm2.launchBus((errLb, bus) => {
        console.log('PM2: Log streaming started.');
        bus.on('log:out', (packet) =>
          console.log(`App (out): ${packet.process.name} - ${packet.data}`),
        );
        bus.on('log:err', (packet) =>
          console.error(`App (err): ${packet.process.name} - ${packet.data}`),
        );
      });
    },
  );
});
