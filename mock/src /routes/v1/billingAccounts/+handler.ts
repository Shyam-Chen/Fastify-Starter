import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  app.get('', async () => {
    return {
      billingAccounts: [
        {
          name: '',
          open: true,
          displayName: '',
          masterBillingAccount: '',
          parent: '',
        },
      ],
      nextPageToken: '',
    };
  });
};
