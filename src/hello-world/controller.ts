import { CatsService } from './service';

export default (app, opts, done) => {
  app.get('/', async (req, reply) => {
    return { cats: CatsService.findAll() };
  });

  app.post('/', async (req, reply) => {
    CatsService.create(req.body);
    return { cats: req.body };
  });

  done();
};
