// import type { FastifyInstance } from 'fastify';

// // POST /new {}
// // GET /:id
// // PUT /:id {}
// // DELETE /:id
// export default async (app: FastifyInstance, props) => {
//   app.post('/new', { schema: props.schema }, async (req, reply) => {
//     if (needEntity) return reply.send({ message: '', entity: {} });
//     return reply.status(201).send({ message: '' });
//   });

//   app.get('/:id', { schema: props.schema }, async (req, reply) => {
//     return reply.send({ message: '', entity: {} });
//   });

//   app.put('/:id', { schema: props.schema }, async (req, reply) => {
//     if (needEntity) return reply.send({ message: '', entity: {} });
//     return reply.status(204).send({ message: '' });
//   });

//   app.delete('/:id', { schema: props.schema }, async (req, reply) => {
//     return reply.status(204).send({ message: '' });
//   });
// };
