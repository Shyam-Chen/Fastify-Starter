import { test, expect } from 'vitest';
import fastify from 'fastify';

import helloWorld from '../+handler';

test('GET /hello-i18n', async () => {
  const app = fastify();

  app.register(helloWorld, { prefix: '/hello-world' });

  const res = await app.inject({ method: 'GET', url: '/hello-world' });
  expect(res.json()).toEqual({ message: 'Hello, World!' });
});
