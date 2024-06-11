import mongodb from '@fastify/mongodb';
import fastify from 'fastify';
import { MongoMemoryServer } from 'mongodb-memory-server';

import todos from '../+handler';

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
  app.register(todos, { prefix: '/todos' });

  const data = Array.from({ length: 31 }).map((item, index) => ({
    title: `fastify-${index + 1}`,
    completed: !(index % 2),
    createdAt: new Date(`2020-12-${index + 1}`).toISOString(),
    updatedAt: new Date(`2020-12-${index + 1}`).toISOString(),
  }));

  await app.ready();
  await app.mongo.db?.collection('todos').insertMany(data);

  const res = await app.inject({ method: 'POST', url: '/todos', payload: {} });
  expect(res.json().result.length).toEqual(10);
  expect(res.json().total).toEqual(31);

  const res2 = await app.inject({ method: 'POST', url: '/todos', payload: { title: '7' } });
  expect(res2.json().result.length).toEqual(3);
  expect(res2.json().total).toEqual(3);

  const res3 = await app.inject({ method: 'POST', url: '/todos', payload: { filter: 2 } });
  expect(res3.json().result.length).toEqual(10);
  expect(res3.json().total).toEqual(16);

  const res4 = await app.inject({ method: 'POST', url: '/todos', payload: { title: 'Vue' } });
  expect(res4.json().result.length).toEqual(0);
  expect(res4.json().total).toEqual(0);

  const res5 = await app.inject({ method: 'POST', url: '/todos', payload: { filter: 1 } });
  expect(res5.json().result.length).toEqual(10);
  expect(res5.json().total).toEqual(15);
});
