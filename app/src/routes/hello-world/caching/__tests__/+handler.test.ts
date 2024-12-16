import KeyvRedis from '@keyv/redis';
import { createCache } from 'cache-manager';
import { CacheableMemory } from 'cacheable';
import fastify from 'fastify';
import Keyv from 'keyv';
import { RedisMemoryServer } from 'redis-memory-server';

import cachingHandler from '../+handler';

vi.mock(import('~/utilities/cache'), async () => {
  const redisServer = new RedisMemoryServer();
  const host = await redisServer.getHost();
  const port = await redisServer.getPort();

  const cache = createCache({
    stores: [
      new Keyv({
        store: new CacheableMemory(),
      }),
      new Keyv({
        store: new KeyvRedis(`redis://${host}:${port}`),
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
