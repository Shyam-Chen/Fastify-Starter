import { test } from 'vitest';
import autocannon from 'autocannon';

test('hello', async () => {
  const result = await autocannon({
    url: 'http://localhost:3000/api/',
    requests: [
      {
        method: 'GET',
        path: '/hello-world',
      },
    ],
  });

  console.log(result);
});
