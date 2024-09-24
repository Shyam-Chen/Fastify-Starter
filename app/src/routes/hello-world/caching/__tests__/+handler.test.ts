import KeyvRedis from '@keyv/redis';
import { createCache } from 'cache-manager';
import { CacheableMemory } from 'cacheable';
import fastify from 'fastify';
import Redis from 'ioredis-mock';
import Keyv from 'keyv';

import cachingHandler from '../+handler';

vi.mock('~/utilities/cache', async () => {
  const redisInstance = new Redis();

  const cache = createCache({
    stores: [
      new Keyv({
        store: new CacheableMemory(),
      }),
      new Keyv({
        store: new KeyvRedis(redisInstance),
      }),
    ],
  });

  return {
    default: cache,
  };
});

test('GET /hello-world/caching', async () => {
  vi.useFakeTimers();

  const app = fastify();

  app.register(cachingHandler, { prefix: '/caching' });

  const res = await app.inject({ method: 'GET', url: '/caching', query: { text: 'foo' } });
  expect(res.json()).toEqual({ message: 'foo' });

  const res2 = await app.inject({ method: 'GET', url: '/caching', query: { text: 'bar' } });
  expect(res2.json()).toEqual({ message: 'foo' });

  vi.advanceTimersByTime(5_000 + 1);

  const res3 = await app.inject({ method: 'GET', url: '/caching', query: { text: 'bar' } });
  expect(res3.json()).toEqual({ message: 'bar' });

  vi.useRealTimers();
});
