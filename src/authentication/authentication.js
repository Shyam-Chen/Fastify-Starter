export default (app, opts, next) => {
  app.post('/sign-up', async () => {
    return {};
  });

  app.post('/sign-in', async () => {
    return {};
  });

  app.get('/profile', async () => {
    return {};
  });

  app.put('/profile', async () => {
    return {};
  });

  app.post('/forgot-password', async () => {
    return {};
  });

  app.post('/change-email', async () => {
    return {};
  });

  app.post('/change-password', async () => {
    return {};
  });

  next();
};
