export default (app, opts, next) => {
  app.get('/items', async () => {
    return {};
  });

  app.get('/item/:id', async () => {
    return {};
  });

  app.post('/item', async () => {
    return {};
  });

  app.put('/item/:id', async () => {
    return {};
  });

  app.delete('/items', async () => {
    return {};
  });

  app.delete('/item/:id', async () => {
    return {};
  });

  next();
};
