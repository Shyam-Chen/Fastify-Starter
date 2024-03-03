import fastify from 'fastify';
import { ioRedisStore } from '@tirke/node-cache-manager-ioredis';
import { caching } from 'cache-manager';
import Redis from 'ioredis-mock';

import cachingRedis from '../+handler';

const redisInstance = new Redis();

vi.mock('~/utilities/redisCache', async () => {
  return {
    default: async (ttl: number) => caching(ioRedisStore, { redisInstance, ttl }),
  };
});

test('GET /hello-world/caching-redis', async () => {
  const app = fastify();

  app.register(cachingRedis, { prefix: '/caching-redis' });

  const res = await app.inject({ method: 'GET', url: '/caching-redis', query: { text: 'foo' } });
  expect(res.json()).toEqual({ message: 'foo' });

  const res2 = await app.inject({ method: 'GET', url: '/caching-redis', query: { text: 'bar' } });
  expect(res2.json()).toEqual({ message: 'foo' });
});
