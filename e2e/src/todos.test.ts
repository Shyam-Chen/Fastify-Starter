import { expect, test } from '@playwright/test';

test('POST /api/todos', async ({ request }) => {
  const response = await request.post('/api/todos', { data: {} });
  const data = await response.json();
  expect(data.total).toEqual(3);
});
