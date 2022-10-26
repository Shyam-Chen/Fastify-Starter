export default {
  NODE_ENV: process.env.NODE_ENV || 'development',

  HOST: process.env.HOST || '127.0.0.1',
  PORT: process.env.PORT || 3000,

  SITE_URL: process.env.SITE_URL || 'http://127.0.0.1:5173',

  MONGODB_URL: process.env.MONGODB_URL || 'mongodb+srv://fastify:starter@cluster0.tes26sm.mongodb.net/mydb?retryWrites=true&w=majority',
  REDIS_URL: process.env.REDIS_URL || 'redis://default:nAYvh2M3SVxvYI5I8w3wD8ZY7N0rYR6p@redis-19326.c99.us-east-1-4.ec2.cloud.redislabs.com:19326',
  CLOUDINARY_URL: process.env.CLOUDINARY_URL || 'cloudinary://636761771455612:nBBydtdox8huZPXHHsxgKFDkiUU@dfi8gex0k',

  SECRET_KEY: process.env.SECRET_KEY || 'jbmpHPLoaV8N0nEpuLxlpT95FYakMPiu',
};
