import { test, expect } from 'vitest';

// import build from '../../app';

// test('GET /hello-world', async () => {
//   const app = await build();

//   const res = await app.inject({
//     method: 'GET',
//     url: '/hello-world',
//   });

//   expect(res.json()).toEqual({ cats: [] });
// });

import fastify from 'fastify';
import helloWorld from '../routes';

test('GET /hello-world', async () => {
  const app = fastify({});
  app.register(helloWorld);

  const res = await app.inject({
    method: 'GET',
    url: '/hello-world',
  });

  expect(res.json()).toEqual({ cats: [] });
});
