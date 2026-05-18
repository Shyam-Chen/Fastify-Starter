import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from 'typebox';
// import { chromium } from 'playwright';

import cache from '~/utilities/cache.ts';

export default (async (app) => {
  /*
  ```sh
  $ curl "https://<PRERENDER_SERVICE>.run.app/render?url=<TARGET_URL>"
  ```
  */
  app.get(
    '',
    {
      schema: {
        querystring: Type.Object({
          url: Type.String(),
        }),
        response: {
          200: Type.String(),
        },
      },
    },
    async (request, reply) => {
      const { url } = request.query;

      const targetUrl = `${process.env.SITE_URL}${url}`;

      const cached = await cache.wrap(
        'render',
        async () => {
          return /* html */ `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Page Title ${targetUrl}</title>
            </head>
            <body>
              <h1>This is a Heading ${targetUrl}</h1>
              <p>This is a paragraph.</p>
            </body>
            </html>
          `;

          // const browser = await chromium.launch({
          //   headless: true,
          //   args: [
          //     '--no-sandbox',
          //     '--disable-setuid-sandbox',
          //     '--disable-dev-shm-usage',
          //     '--disable-gpu',
          //   ],
          // });

          // const page = await browser.newPage();
          // await page.goto(targetUrl, { waitUntil: 'networkidle' });
          // const html = await page.content();
          // await browser.close();

          // return html;
        },
        24 * 60 * 60 * 1000,
      );

      return reply.header('Content-Type', 'text/html; charset=utf-8').send(cached);
    },
  );
}) as FastifyPluginAsyncTypebox;
