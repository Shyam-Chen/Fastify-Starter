import { test, expect } from 'vitest';
import fastify from 'fastify';

import i18n from '~/plugins/i18n';

import helloWorld from '../registry';

test('GET /', async () => {
  const app = fastify();

  app.register(i18n);
  app.register(helloWorld);

  const res = await app.inject({ method: 'GET', url: '/' });
  expect(res.json()).toEqual({ hello: 'Hello, World!', text: 'Text' });
});

test('GET / ja-JP', async () => {
  const app = fastify();

  app.register(i18n);
  app.register(helloWorld);

  const res = await app.inject({
    method: 'GET',
    url: '/',
    headers: { 'Accept-Language': 'ja-JP' },
  });

  expect(res.json()).toEqual({ hello: 'こんにちは世界！', text: 'テキスト' });
});
