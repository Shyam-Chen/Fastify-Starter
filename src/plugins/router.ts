import plugin from 'fastify-plugin';

import userListRoutes from '~/modules/user-list/routes';

export default plugin(
  async (app, opts) => {
    const { prefix } = opts;

    app.register(import('~/modules/hello-world/registry'), { prefix: prefix + '/hello-world' });
    app.register(import('~/modules/auth/registry'), { prefix: prefix + '/auth' });

    app.register(import('~/modules/todos/registry'), { prefix: prefix + '/todos' });
    app.register(import('~/modules/todos/[id]/registry'), { prefix: prefix + '/todos/:id' });

    app.register(import('~/modules/echo/registry'), { prefix });
    app.register(import('~/modules/sse/registry'), { prefix });

    app.register(import('~/modules/file-uploads/registry'), { prefix });
    app.register(import('~/modules/suggestions/registry'), { prefix: prefix + '/suggestions' });
    app.register(import('~/modules/assets-public/registry'), { prefix: prefix + '/assets-public' });
    app.register(import('~/modules/auto-use/registry'), { prefix: prefix + '/auto-use' });
    app.register(import('~/modules/email/registry'), { prefix: prefix + '/email' });
    app.register(import('~/modules/queues/registry'), { prefix: prefix + '/queues' });

    app.register(userListRoutes, { prefix: prefix + '/user-list' });
  },
  { name: 'router' },
);
