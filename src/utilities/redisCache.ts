import { caching } from 'cache-manager';
import { ioRedisStore } from '@tirke/node-cache-manager-ioredis';

import redisInstance from './redisInstance';

type Seconds = number;

export default async (ttl: Seconds) => {
  return caching(ioRedisStore, { redisInstance, ttl });
};
