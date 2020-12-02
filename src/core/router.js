import helloWorld from '~/hello-world';
import crudOperations from '~/crud-operations/crud-operations';

export default (app, opts, next) => {
  app.get('/', async () => 'app-root');
  app.register(helloWorld, helloWorld.opts);
  app.register(crudOperations, { prefix: '/crud-operations' });

  next();
};
