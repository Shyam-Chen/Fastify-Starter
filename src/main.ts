import app from './app';

const start = async () => {
  const server = await app({
    logger: {
      transport: {
        target: '@fastify/one-line-logger',
      },
    },
  });

  try {
    server.listen({
      host: process.env.HOST,
      port: process.env.PORT,
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }

  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeFullReload', () => {
      server.close();
    });

    import.meta.hot.dispose(() => {
      server.close();
    });
  }
};

start();
