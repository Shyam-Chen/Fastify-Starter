import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import nodemailer from 'nodemailer';
import nunjucks from 'nunjucks';

import useMailer from '~/composables/useMailer';
import helloWorld from '~/templates/hello-world.html?raw';

export default (async (app) => {
  /*
  $ curl --request GET \
         --url http://127.0.0.1:3000/api/email
  */
  app.get(
    '',
    {
      schema: {
        response: { '2xx': { messageId: Type.String() } },
      },
    },
    async (req, reply) => {
      const mailer = useMailer();

      const info = await mailer.sendMail({
        to: 'bar@example.com, baz@example.com',
        subject: 'Hello ✔',
        html: nunjucks.renderString(helloWorld, { hello: 'Hello, MJML!' }),
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('TestMessageUrl =', nodemailer.getTestMessageUrl(info));
      }

      return reply.send({ messageId: info.messageId });
    },
  );
}) as FastifyPluginAsyncTypebox;
