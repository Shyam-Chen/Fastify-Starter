import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  app.get('', { websocket: true }, (socket) => {
    app.log.info('Client connected');

    socket.on('message', (message: MessageEvent) => {
      console.log(`Client message: ${message}`);
      socket.send('Hello from Fastify!');
    });

    socket.on('close', () => {
      app.log.info('Client disconnected');
    });
  });
};
