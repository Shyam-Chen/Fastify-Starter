import websocket from '@fastify/websocket';
import fastify from 'fastify';

import echo from '../+handler';

test('WS /echo', async () => {
  const app = fastify();

  app.register(websocket);
  app.register(echo, { prefix: '/echo' });

  await app.ready();
  const ws = await app.injectWS('/echo');

  let resolve: (value: string) => void;

  const promise = new Promise<string>((_resolve) => {
    resolve = _resolve;
  });

  ws.on('message', (data: MessageEvent) => {
    resolve(data.toString());
  });

  ws.send('Hi from Test!');

  expect(await promise).toEqual('Hello from Fastify!');

  ws.terminate();
});
