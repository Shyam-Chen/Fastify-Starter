import Redis from 'ioredis';

const redisInstance = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export default redisInstance;
