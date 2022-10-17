export default {
  NODE_ENV: process.env.NODE_ENV || 'development',

  HOST: process.env.HOST || '127.0.0.1',
  PORT: process.env.PORT || 3000,

  SITE_URL: process.env.SITE_URL || 'http://127.0.0.1:5173',

  MONGODB_URL: process.env.MONGODB_URL || 'mongodb+srv://fastify:starter@cluster0.tes26sm.mongodb.net/mydb?retryWrites=true&w=majority',
  REDIS_URL: process.env.REDIS_URL || '',

  SECRET_KEY: process.env.SECRET_KEY || 'jbmpHPLoaV8N0nEpuLxlpT95FYakMPiu',
};
