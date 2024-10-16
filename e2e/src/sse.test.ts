import { expect, test } from '@playwright/test';
import { events } from 'fetch-event-stream';

test('ES /api/sse', async ({ baseURL }) => {
  const abortController = new AbortController();
  const response = await fetch(`${baseURL}/api/sse`, { signal: abortController.signal });
  const stream = events(response, abortController.signal);

  for await (const event of stream) {
    expect(event.data).toBe('Some message');
    abortController.abort();
  }
});
