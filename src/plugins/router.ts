import plugin from 'fastify-plugin';

export default plugin(
  async (app, opts) => {
    const { prefix } = opts;

    app.register(import ('~/modules/hello-world'), { prefix });
    app.register(import ('~/modules/sign-in'), { prefix });

    return;
  },
  { name: 'router' },
);
