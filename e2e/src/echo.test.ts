import { expect, test } from '@playwright/test';
import WebSocket from 'ws';

test('WS /api/echo', async ({ baseURL }) => {
  const url = new URL(baseURL as string);
  const ws = new WebSocket(`ws://${url.host}/api/echo`);

  await new Promise<void>((resolve) => {
    ws.onopen = () => {
      ws.send('Hello from Playwright!');
      resolve();
    };
  });

  const messagePromise = new Promise<string>((resolve) => {
    ws.onmessage = (event) => {
      resolve(event.data as string);
    };
  });

  const message = await messagePromise;
  expect(message).toBe('Hello from Fastify!');

  ws.close();
});
