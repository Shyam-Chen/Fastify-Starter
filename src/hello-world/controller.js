const controller = (app, opts, next) => {
  app.get('/', async () => {
    return { data: 'Hello, World!' };
  });

  next();
};

controller.opts = { prefix: '/hello-world' };

export default controller;
