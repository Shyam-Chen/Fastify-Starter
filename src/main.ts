import app from './app';

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
