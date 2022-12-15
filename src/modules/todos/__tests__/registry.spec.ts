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

test('POST /todos', async () => {
  const app = fastify();

  app.register(mongodb, { url: mongod?.getUri('test') });
  app.register(registry, { prefix: '/todos' });

  const data = Array.from({ length: 31 }).map((item, index) => ({
    title: `fastify-${index + 1}`,
    completed: !(index % 2),
    createdAt: new Date(`2020-12-${index + 1}`).toISOString(),
    updatedAt: new Date(`2020-12-${index + 1}`).toISOString(),
  }));

  await app.ready();
  await app.mongo.db?.collection('todos').insertMany(data);

  const res = await app.inject({ method: 'POST', url: '/todos', payload: {} });
  expect(res.json().result.length).toBe(10);
  expect(res.json().total).toBe(31);

  const res2 = await app.inject({ method: 'POST', url: '/todos', payload: { title: '7' } });
  expect(res2.json().result.length).toBe(3);
  expect(res2.json().total).toBe(3);

  const res3 = await app.inject({ method: 'POST', url: '/todos', payload: { completed: true } });
  expect(res3.json().result.length).toBe(10);
  expect(res3.json().total).toBe(16);

  const res4 = await app.inject({ method: 'POST', url: '/todos', payload: { title: 'Vue' } });
  expect(res4.json().result.length).toBe(0);
  expect(res4.json().total).toBe(0);
});
