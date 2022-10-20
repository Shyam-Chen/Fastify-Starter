import { test, expect } from 'vitest';
import fastify from 'fastify';

import i18n from '~/plugins/i18n';

import helloWorld from '../registry';

test('GET /hello-world', async () => {
  const app = fastify();

  app.register(i18n);
  app.register(helloWorld);

  const res = await app.inject({
    method: 'GET',
    url: '/hello-world',
  });

  expect(res.json()).toEqual({ hello: 'Hello, World!', text: 'Text' });
});