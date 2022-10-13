import type { FastifyInstance } from 'fastify';
import Polyglot from 'node-polyglot';

import enUS from './_locales/en-US';
import jaJP from './_locales/ja-JP';
import koKR from './_locales/ko-KR';
import zhTW from './_locales/zh-TW';

export default async (app: FastifyInstance) => {
  app.addHook('preParsing', async (req, reply) => {
    const polyglot = new Polyglot();
    const acceptLanguage = req.headers['accept-language'];

    if (acceptLanguage === 'ja-JP') {
      polyglot.locale(acceptLanguage);
      polyglot.extend(jaJP);
    } else if (acceptLanguage === 'ko-KR') {
      polyglot.locale(acceptLanguage);
      polyglot.extend(koKR);
    } else if (acceptLanguage === 'zh-TW') {
      polyglot.locale(acceptLanguage);
      polyglot.extend(zhTW);
    } else {
      polyglot.locale('en-US');
      polyglot.extend(enUS);
    }

    // useI18n({ useScope: 'local' })
    req.i18n = polyglot;

    return;
  });

  /*
  curl --request GET \
    --url http://127.0.0.1:3000/api/hello-world \
    --header 'accept-language: ja-JP'
  */
  app.get('/hello-world', async (req, reply) => {
    return { text: req.i18n.t('hello') };
  });

  return;
};
