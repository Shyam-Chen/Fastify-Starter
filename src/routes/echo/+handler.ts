import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  app.get('', { websocket: true }, (con) => {
    app.log.info('Client connected');

    con.socket.on('message', (message: MessageEvent) => {
      console.log(`Client message: ${message}`);
      con.socket.send('Hello from Fastify!');
    });

    con.socket.on('close', () => {
      app.log.info('Client disconnected');
    });
  });
};
