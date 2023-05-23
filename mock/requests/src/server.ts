import app from './app';

const server = app();

const start = async () => {
  try {
    await server.listen({ port: 6000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
