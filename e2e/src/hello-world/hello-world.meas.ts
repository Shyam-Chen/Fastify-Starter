import { test, expect } from 'vitest';
import autocannon from 'autocannon';

test('GET /hello-world', async () => {
  const res = await autocannon({ url: 'http://127.0.0.1:3000/api/hello-world' });
  expect(res.non2xx).toBe(0);
});
