import fastify from 'fastify';
import websocket from '@fastify/websocket';
// import mongodb from '@fastify/mongodb';

import helloWorld from '~/hello-world/routes';

const app = async (options = {}) => {
  const app = fastify(options);

  app.register(websocket);
  // app.register(mongodb, { url: 'mongodb://mongo/mydb' });

  app.get('/', (req, reply) => {
    console.log('process.env.NODE_ENV =', process.env.NODE_ENV);
    console.log('process.env.SECRET =', process.env.SECRET);

    reply.send('change me to see updates, fastify!');
  });


  app.register(async (fastify) => {
    fastify.get('/ws', { websocket: true }, (con, req) => {
      console.log('Client connected');

      con.socket.send(`Hello Fastify!`);

      con.socket.on('message', (message: any) => {
        console.log(`Client message: ${message}`);
      })

      con.socket.on('close', () => {
        console.log('Client disconnected');
      });
    });
  });

  app.register(helloWorld);

  return app;
};

export default app;
