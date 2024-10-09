import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('POST /api/todos', async ({ request }) => {
  const response = await request.post('/api/todos', { data: {} });
  const data = await response.json();
  expect(data.total).toEqual(3);
});

test('POST /api/todos/new', async ({ request }) => {
  const response = await request.post('/api/todos/new', {
    data: { title: 'foo' },
  });
  const data = await response.json();
  expect(data.message).toEqual('OK');
});

test('POST /api/todos { "title": "foo" }', async ({ request }) => {
  const response = await request.post('/api/todos', { data: { title: 'foo' } });
  const data = await response.json();
  expect(data.total).toEqual(1);
  expect(data.result[0]).toEqual(expect.objectContaining({ title: 'foo', completed: false }));
});
