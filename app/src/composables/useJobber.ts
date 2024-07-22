import { resolve } from 'node:path';
import type { BreeOptions } from 'bree';
import Bree from 'bree';

export default (config?: BreeOptions) => {
  const bree = new Bree({
    root: resolve(import.meta.dirname, '../jobs'),
    ...config,
  });

  return bree;
};
