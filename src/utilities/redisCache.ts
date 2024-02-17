import type { Milliseconds } from 'cache-manager';
import { caching } from 'cache-manager';
import { ioRedisStore } from '@tirke/node-cache-manager-ioredis';

import redisInstance from './redisInstance';

export default async (ttl: Milliseconds) => {
  return caching(ioRedisStore, { redisInstance, ttl });
};
