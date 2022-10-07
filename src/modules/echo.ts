import type { FastifyInstance } from 'fastify';

export default async (app: FastifyInstance) => {
  app.get('/echo', { websocket: true }, (con, req) => {
    console.log('Client connected');

    con.socket.send(`Hello Fastify!`);

    con.socket.on('message', (message: any) => {
      console.log(`Client message: ${message}`);
    });

    con.socket.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return;
};
