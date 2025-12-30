import fastify from 'fastify';

import helloWorld from '../+handler.ts';

test('GET /hello-world', async () => {
  const app = fastify();

  app.register(helloWorld, { prefix: '/hello-world' });

  const res = await app.inject({ method: 'GET', url: '/hello-world' });
  expect(res.json()).toEqual({ message: 'Hello, World!' });
});
