import { beforeAll, afterAll, test, expect } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fastify from 'fastify';
import mongodb from '@fastify/mongodb';

import registry from '../registry';

let mongod = null as MongoMemoryServer | null;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
});

afterAll(async () => {
  await mongod?.stop();
});

test.concurrent('test_todos_1', async (ctx) => {
  const app = fastify();

  app.register(mongodb, { url: mongod?.getUri(ctx.meta.name) });
  app.register(registry);

  await app.inject({
    method: 'POST',
    url: '/todos',
    payload: {
      title: 'foo',
    },
  });

  const res = await app.inject({
    method: 'GET',
    url: '/todos',
  });

  expect(res.json().result.length).toBe(1);
  expect(res.json().total).toBe(1);

  const id = res.json().result[0]._id;

  const res1 = await app.inject({
    method: 'GET',
    url: '/todos' + `/${id}`,
  });

  expect(res1.json().result.title).toBe('foo');

  await app.inject({
    method: 'PUT',
    url: '/todos' + `/${id}`,
    payload: {
      title: 'foo',
      completed: true,
    },
  });

  const res2 = await app.inject({ method: 'GET', url: '/todos' + `/${id}` });
  expect(res2.json().result.title).toBe('foo');
  expect(res2.json().result.completed).toBe(true);

  await app.inject({
    method: 'DELETE',
    url: '/todos' + `/${id}`,
  });

  const res3 = await app.inject({ method: 'GET', url: '/todos' });
  expect(res3.json().result.length).toBe(0);
  expect(res3.json().total).toBe(0);
});

test.concurrent('test_todos_2', async (ctx) => {
  const app = fastify();

  app.register(mongodb, { url: mongod?.getUri(ctx.meta.name) });
  app.register(registry);

  const data = Array.from({ length: 31 }).map((item, index) => ({
    title: `fastify-${index + 1}`,
    completed: !(index % 2),
    createdAt: new Date(`2020-12-${index + 1}`).toISOString(),
  }));

  await app.ready();
  await app.mongo.db?.collection('todos').insertMany(data);

  const res = await app.inject({ method: 'GET', url: '/todos' });
  expect(res.json().result.length).toBe(10);
  expect(res.json().total).toBe(31);

  const res2 = await app.inject({ method: 'GET', url: '/todos?completed=true' });
  expect(res2.json().result.length).toBe(10);
  expect(res2.json().total).toBe(16);

  const res3 = await app.inject({ method: 'GET', url: '/todos?title=6' });
  expect(res3.json().result.length).toBe(3);
  expect(res3.json().total).toBe(3);
});
