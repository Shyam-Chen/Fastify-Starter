import app from './app.ts';

const server = app();

const start = async () => {
  try {
    await server.listen({
      host: process.env.HOST,
      port: process.env.PORT,
    });
  } catch (err) {
    server.log.error(err);

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
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
