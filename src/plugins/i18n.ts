import plugin from 'fastify-plugin';
import Polyglot from 'node-polyglot';

import enUS from '~/locales/en-US';
import jaJP from '~/locales/ja-JP';
import koKR from '~/locales/ko-KR';
import zhTW from '~/locales/zh-TW';

export default plugin(
  async (app, opts) => {
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

      // useI18n({ useScope: 'global' })
      req.polyglot = polyglot;

      return;
    });

    return;
  },
  { name: 'i18n' },
);
