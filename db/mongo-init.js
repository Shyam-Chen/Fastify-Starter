db = db.getSiblingDB('admin');
db.auth(process.env.MONGO_INITDB_ROOT_USERNAME, process.env.MONGO_INITDB_ROOT_PASSWORD);

db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);

db.createUser({
  user: process.env.MONGO_INITDB_ROOT_USERNAME,
  pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
  roles: [
    {
      role: 'readWrite',
      db: process.env.MONGO_INITDB_DATABASE,
    },
  ],
});

db = new Mongo().getDB(process.env.MONGO_INITDB_DATABASE);

// load('./src/todos.js');

db.createCollection('todos');

db.todos.insertMany([
  {
    title: 'Node.js',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'Fastify',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'MongoDB',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);
