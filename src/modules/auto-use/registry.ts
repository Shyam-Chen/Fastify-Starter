import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  app.register(import('./feat-foo/registry'), { prefix: '/feat-foo' });
  app.register(import('./feat-bar/registry'), { prefix: '/feat-bar' });
};
