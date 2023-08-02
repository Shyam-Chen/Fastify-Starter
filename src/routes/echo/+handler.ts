import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  app.get('', { websocket: true }, (con) => {
    console.log('Client connected');

    con.socket.send(`Hello from Fastify!`);

    con.socket.on('message', (message: MessageEvent) => {
      console.log(`Client message: ${message}`);
    });

    con.socket.on('close', () => {
      console.log('Client disconnected');
    });
  });
};
