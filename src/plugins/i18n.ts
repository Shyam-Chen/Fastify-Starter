import plugin from 'fastify-plugin';
import i18n from 'fastify-i18n';

import enUS from '~/locales/en-US';
import jaJP from '~/locales/ja-JP';
import koKR from '~/locales/ko-KR';
import zhTW from '~/locales/zh-TW';

export default plugin(
  async (app, opts) => {
    app.register(i18n, {
      fallbackLocale: 'en-US',
      messages: {
        'en-US': enUS,
        'ja-JP': jaJP,
        'ko-KR': koKR,
        'zh-TW': zhTW,
      },
    });
  },
  { name: 'i18n' },
);
