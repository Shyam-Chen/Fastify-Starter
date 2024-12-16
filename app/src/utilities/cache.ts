import KeyvRedis from '@keyv/redis';
import { createCache } from 'cache-manager';
import { CacheableMemory } from 'cacheable';
import Keyv from 'keyv';

export default createCache({
  stores: [
    new Keyv({
      store: new CacheableMemory(),
    }),
    new Keyv({
      store: new KeyvRedis(process.env.REDIS_URL),
    }),
  ],
});
