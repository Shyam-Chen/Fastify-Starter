import { test, expect } from 'vitest';
import fastify from 'fastify';

import i18n from '~/plugins/i18n';

import helloI18n from '../+handler';

test('GET /hello-i18n', async () => {
  const app = fastify();

  app.register(i18n);
  app.register(helloI18n, { prefix: '/hello-i18n' });

  const res = await app.inject({ method: 'GET', url: '/hello-i18n' });
  expect(res.json()).toEqual({ hello: 'Hello, World!', text: 'Text' });
});

test('GET / ja-JP', async () => {
  const app = fastify();

  app.register(i18n);
  app.register(helloI18n, { prefix: '/hello-world' });

  const res = await app.inject({
    method: 'GET',
    url: '/hello-world',
    headers: { 'Accept-Language': 'ja-JP' },
  });

  expect(res.json()).toEqual({ hello: 'こんにちは世界！', text: 'テキスト' });
});
