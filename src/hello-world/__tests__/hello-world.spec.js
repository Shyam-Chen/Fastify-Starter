import app from '~/app';

describe('hello-world', () => {
  afterAll(() => {
    app.close();
  });

  test('responds with success on request /', async () => {
    const response = await app.inject({ method: 'GET', url: '/hello-world' });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({ text: 'hello-world' });
  });
});
