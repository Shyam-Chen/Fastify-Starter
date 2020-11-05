import app from './app';

app.listen(process.env.SITE_PORT, process.env.HOST_NAME, (err, address) => {
  if (err) throw err;
  app.log.info(`Application listening on ${address}`);
});

if (module.hot) {
  module.hot.accept();

  module.hot.dispose(() => {
    app.close().then(
      () => {
        console.log('successfully closed!');
      },
      err => {
        console.log('an error happened', err);
      },
    );
  });
}
