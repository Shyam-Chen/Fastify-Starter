import Redis from 'ioredis';

const redisInstance = new Redis(process.env.REDIS_URL);

export default redisInstance;
