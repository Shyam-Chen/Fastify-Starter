import fastify from 'fastify';

import i18n from '~/plugins/i18n.ts';

import helloI18n from '../+handler.ts';

test('GET /hello-i18n', async () => {
  const app = fastify();

  app.register(i18n);
  app.register(helloI18n, { prefix: '/hello-i18n' });

  const res = await app.inject({ method: 'GET', url: '/hello-i18n' });
  expect(res.json()).toEqual({ hello: 'Hello, World!', text: 'Text' });
});

test('GET /hello-i18n ja-JP', async () => {
  const app = fastify();

  app.register(i18n);
  app.register(helloI18n, { prefix: '/hello-i18n' });

  const res = await app.inject({
    method: 'GET',
    url: '/hello-i18n',
    headers: { 'Accept-Language': 'ja-JP' },
  });

  expect(res.json()).toEqual({ hello: 'こんにちは世界！', text: 'テキスト' });
});
