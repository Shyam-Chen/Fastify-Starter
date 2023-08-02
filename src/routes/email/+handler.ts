import type { FastifyInstance } from 'fastify';
import nunjucks from 'nunjucks';

import useMailer from '~/composables/useMailer';
import helloWorld from '~/templates/hello-world.html?raw';

export default async (app: FastifyInstance) => {
  app.get('', async (req, reply) => {
    const mailer = useMailer();

    const info = await mailer.sendMail({
      to: 'bar@example.com, baz@example.com',
      subject: 'Hello ✔',
      html: nunjucks.renderString(helloWorld, { hello: 'Hello, MJML!' }),
    });

    return reply.send({ messageId: info.messageId });
  });
};
