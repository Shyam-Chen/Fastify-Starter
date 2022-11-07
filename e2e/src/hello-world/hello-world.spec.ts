import { test, expect } from 'vitest';
import got from 'got';

test('GET /hello-world', async () => {
  const res = await got.get('http://127.0.0.1:3000/api/hello-world').json();
  expect(res).toEqual({ hello: 'Hello, World!', text: 'Text' });
});
