import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('POST /api/todos', async ({ request }) => {
  const response = await request.post('/api/todos', { data: {} });
  const data = await response.json();
  expect(data.total).toEqual(3);
});

test('POST /api/todos/new', async ({ request }) => {
  const body = { title: 'foo' };
  const response = await request.post('/api/todos/new', { data: body });
  const data = await response.json();
  expect(data.message).toEqual('OK');
});

let _id = '';

test('POST /api/todos { "title": "foo" }', async ({ request }) => {
  const response = await request.post('/api/todos', { data: { title: 'foo' } });
  const data = await response.json();
  expect(data.total).toEqual(1);
  expect(data.result[0]).toEqual(expect.objectContaining({ title: 'foo', completed: false }));
  _id = data.result[0]._id;
});

test('GET /api/todos/:id', async ({ request }) => {
  const response = await request.get(`/api/todos/${_id}`);
  const data = await response.json();
  expect(data.result).toEqual(expect.objectContaining({ title: 'foo', completed: false }));
});

test('PUT /api/todos/:id', async ({ request }) => {
  const body = { title: 'foo', completed: true };
  const response = await request.put(`/api/todos/${_id}`, { data: body });
  const data = await response.json();
  expect(data.message).toEqual('OK');
});

test('DELETE /api/todos/:id', async ({ request }) => {
  const response = await request.delete(`/api/todos/${_id}`);
  const data = await response.json();
  expect(data.message).toEqual('OK');
});
