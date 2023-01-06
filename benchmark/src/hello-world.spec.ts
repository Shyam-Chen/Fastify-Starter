import { test } from 'vitest';
import autocannon from 'autocannon';

test('/hello-world', async () => {
  const result = await autocannon({
    url: 'http://localhost:3000',
    requests: [
      {
        method: 'GET',
        path: '/api/hello-world',
      },
    ],
  });

  console.log(result);
});
