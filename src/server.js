let app = require('./app').default;

const server = app({
  logger: {
    level: 'info',
    // prettyPrint: true
  },
});

server.listen(process.env.SITE_PORT, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});

if (module.hot) {
  // module.hot.accept('./app', () => {
  //   try {
  //     server.removeAllListeners('request', server);
  //     // eslint-disable-next-line global-require
  //     app = require('./app').default;
  //     server.on('request', app.callback());
  //   } catch (err) {
  //     // The exception is handled by Webpack.
  //   }
  // });

  module.hot.accept();
  module.hot.dispose(() => server.close());
}
