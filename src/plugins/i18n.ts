import plugin from 'fastify-plugin';
import i18n from 'fastify-i18n';

export default plugin(
  async (app) => {
    app.register(i18n, {
      fallbackLocale: 'en-US',
      messages: import.meta.glob(['~/locales/*.ts'], { eager: true }),
    });
  },
  { name: 'i18n' },
);
