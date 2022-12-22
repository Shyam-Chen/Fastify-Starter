import type { FastifyInstance } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { defineI18n, useI18n } from 'fastify-i18n';

import enUS from './_locales/en-US';
import jaJP from './_locales/ja-JP';
import koKR from './_locales/ko-KR';
import zhTW from './_locales/zh-TW';

const response = {
  200: Type.Object({
    hello: Type.String(),
    text: Type.String(),
  }),
};

export default async (app: FastifyInstance) => {
  const router = app.withTypeProvider<TypeBoxTypeProvider>();

  defineI18n(app, {
    en: enUS,
    'en-US': enUS,
    ja: jaJP,
    'ja-JP': jaJP,
    ko: koKR,
    'ko-KR': koKR,
    zh: zhTW,
    'zh-TW': zhTW,
  });

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/hello-world \
    --header 'Accept-Language: ja-JP'
  */
  router.get('/hello-world', { schema: { response } }, async (req, reply) => {
    const i18n = useI18n(req);

    return reply.send({
      hello: i18n.t('hello'),
      text: req.i18n.t('text'),
    });
  });
};
