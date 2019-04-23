export default (app, opts, next) => {
  app.get('/', async () => {
    return { text: 'hello-world' };
  });

  next();
};
