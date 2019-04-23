import helloWorld from '~/hello-world/hello-world';
import crudOperations from '~/crud-operations/crud-operations';

export default (app, opts, next) => {
  app.get('/', async () => 'app-root');
  app.register(helloWorld, { prefix: '/hello-world' });
  app.register(crudOperations, { prefix: '/crud-operations' });

  next();
};
