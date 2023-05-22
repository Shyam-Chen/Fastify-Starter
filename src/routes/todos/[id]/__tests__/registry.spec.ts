import { beforeAll, afterAll, test, expect } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fastify from 'fastify';
import mongodb from '@fastify/mongodb';

import todosRegistry from '~/routes/todos/registry';

import registry from '../registry';

let mongod = null as MongoMemoryServer | null;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
});

afterAll(async () => {
  await mongod?.stop();
});

test('POST /todos/new', async () => {
  const app = fastify();

  app.register(mongodb, { url: mongod?.getUri('test') });
  app.register(todosRegistry, { prefix: '/todos' });
  app.register(registry, { prefix: '/todos/:id' });

  const payload = { title: 'foo' };
  await app.inject({ method: 'POST', url: '/todos/new', payload });

  const res = await app.inject({ method: 'POST', url: '/todos', payload: {} });
  expect(res.json().result.length).toBe(1);
  expect(res.json().total).toBe(1);

  const id = res.json().result[0]._id;
  const res1 = await app.inject({ method: 'GET', url: '/todos' + `/${id}` });
  expect(res1.json().result.title).toBe(payload.title);

  await app.inject({
    method: 'PUT',
    url: '/todos' + `/${id}`,
    payload: {
      _id: id,
      ...payload,
      completed: true,
    },
  });

  const res2 = await app.inject({ method: 'GET', url: '/todos' + `/${id}` });
  expect(res2.json().result.title).toBe(payload.title);
  expect(res2.json().result.completed).toBe(true);

  await app.inject({ method: 'DELETE', url: '/todos' + `/${id}` });

  const res3 = await app.inject({ method: 'POST', url: '/todos', payload: {} });
  expect(res3.json().result.length).toBe(0);
  expect(res3.json().total).toBe(0);
});
