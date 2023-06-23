import { test, expect } from '@playwright/test';

test('GET /api/hello-world', async ({ request }) => {
  const response = await request.get('/api/hello-world');
  expect(await response.json()).toEqual({ message: 'Hello, World!' });
});
