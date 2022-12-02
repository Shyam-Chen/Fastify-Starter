import plugin from 'fastify-plugin';

export default plugin(
  async (app, opts) => {
    const { prefix } = opts;

    app.register(import('~/modules/hello-world/registry'), { prefix });
    app.register(import('~/modules/auth/registry'), { prefix: prefix + '/auth' });

    app.register(import('~/modules/products/registry'), { prefix: prefix + '/products' });
    app.register(import('~/modules/nested/routes'), { prefix: prefix + '/nested' });

    app.register(import('~/modules/todos/registry'), { prefix });
    app.register(import('~/modules/file-uploads/registry'), { prefix });
    app.register(import('~/modules/suggestions/registry'), { prefix: prefix + '/suggestions' });
    app.register(import('~/modules/assets-public/registry'), { prefix: prefix + '/assets-public' });
    app.register(import('~/modules/auto-use/registry'), { prefix: prefix + '/auto-use' });
    app.register(import('~/modules/email/registry'), { prefix: prefix + '/email' });
  },
  { name: 'router' },
);
