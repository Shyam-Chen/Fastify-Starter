import type { Milliseconds } from 'cache-manager';
import { caching } from 'cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

export default async (ttl: Milliseconds) => {
  const redisCacheStore = await redisStore({ path: process.env.REDIS_URL, ttl });
  return caching(redisCacheStore);
};
