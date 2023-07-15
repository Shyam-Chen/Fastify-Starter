import { test } from 'vitest';
import autocannon from 'autocannon';

test.skip('/todos', async () => {
  const result = await autocannon({
    url: 'http://localhost:3000',
    requests: [
      {
        method: 'POST',
        path: '/api/todos',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    ],
  });

  console.log(result);
});
