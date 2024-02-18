// db = connect('mongodb://root:rootpasswd@127.0.0.1:27017/mydb?retryWrites=true&w=majority');

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
