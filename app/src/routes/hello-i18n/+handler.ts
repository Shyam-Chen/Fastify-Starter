import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from 'typebox';
import { defineI18n } from 'fastify-i18n';

export default (async (app) => {
  defineI18n(app, import.meta.glob(['./locales/*.ts'], { eager: true }));

  /*
  $ curl --request GET \
         --header 'Accept-Language: ja-JP' \
         --url http://127.0.0.1:3000/api/hello-i18n

  $ curl --request GET \
         --header 'Accept-Language: zh' \
         --url http://127.0.0.1:3000/api/hello-i18n

  $ curl --request GET \
         --header 'Accept-Language: de-DE' \
         --url http://127.0.0.1:3000/api/hello-i18n
  */
  app.get(
    '',
    {
      schema: {
        response: {
          200: Type.Object({
            hello: Type.String(),
            text: Type.String(),
          }),
        },
      },
    },
    async (req, reply) => {
      return reply.send({
        hello: req.i18n.t('hello'),
        text: req.i18n.t('text'),
      });
    },
  );
}) as FastifyPluginAsyncTypebox;
