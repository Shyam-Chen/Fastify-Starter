import mongodb from '@fastify/mongodb';
import fastify from 'fastify';
import { MongoMemoryServer } from 'mongodb-memory-server';

import todos from '~/routes/todos/+handler';

import todos_id from '../+handler';

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
  app.register(todos, { prefix: '/todos' });
  app.register(todos_id, { prefix: '/todos/:id' });

  const payload = { title: 'foo' };
  await app.inject({ method: 'POST', url: '/todos/new', payload });

  const res = await app.inject({ method: 'POST', url: '/todos', payload: {} });
  expect(res.json().result.length).toEqual(1);
  expect(res.json().total).toEqual(1);

  const id = res.json().result[0]._id;
  const res1 = await app.inject({ method: 'GET', url: `/todos/${id}` });
  expect(res1.json().result.title).toEqual(payload.title);

  await app.inject({
    method: 'PUT',
    url: `/todos/${id}`,
    payload: { ...payload, completed: true },
  });

  const res2 = await app.inject({ method: 'GET', url: `/todos/${id}` });
  expect(res2.json().result.title).toEqual(payload.title);
  expect(res2.json().result.completed).toEqual(true);

  await app.inject({ method: 'DELETE', url: `/todos/${id}` });

  const res3 = await app.inject({ method: 'POST', url: '/todos', payload: {} });
  expect(res3.json().result.length).toEqual(0);
  expect(res3.json().total).toEqual(0);
});
