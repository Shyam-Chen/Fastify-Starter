export default new (class Environment {
  NODE_ENV = process.env.NODE_ENV || 'development';

  MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://fastify:starter@cluster0.tes26sm.mongodb.net/mydb?retryWrites=true&w=majority'

  SECRET_KEY = process.env.SECRET_KEY || 'jbmpHPLoaV8N0nEpuLxlpT95FYakMPiu';
})();
