// import logRequest from '~/middleware/log-request';
// app.method(path, { preHandler: [logRequest] }, handler);

export default async (request, reply) => {
  console.log('body =', request.body);
  console.log('query =', request.query);
  console.log('params =', request.params);
};
