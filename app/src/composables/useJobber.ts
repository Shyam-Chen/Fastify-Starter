import { resolve } from 'node:path';
import Bree from 'bree';

const bree = new Bree({
  root: resolve(import.meta.dirname, '../jobs'),
  jobs: [{ name: 'hello' }],
});

export default () => {
  return bree;
};
