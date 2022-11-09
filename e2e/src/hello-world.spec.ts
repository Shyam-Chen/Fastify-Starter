import { test, expect } from '@playwright/test';

test('GET /api/hello-world', async ({ request }) => {
  const response = await request.get('/api/hello-world');
  expect(await response.json()).toEqual({ hello: 'Hello, World!', text: 'Text' });
});
