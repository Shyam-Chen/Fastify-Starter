import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  app.register(import('./marketing/registry'), { prefix: '/marketing' });

  app.register(import('~/modules/nested/products/registry'), { prefix: '/products' });
  app.register(import('~/modules/nested/products/[id]/registry'), { prefix: '/products/:id' });
  app.register(import('~/modules/nested/products/new/registry'), { prefix: '/products/new' });
};
