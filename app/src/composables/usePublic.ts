import fs from 'node:fs';
import path from 'node:path';

export default (file: string) => {
  let filePath = '';

  if (process.env.NODE_ENV === 'development') {
    filePath = path.resolve(process.cwd(), './public', file);
  }

  if (process.env.NODE_ENV === 'production') {
    filePath = path.resolve(import.meta.dirname, '../', file);
  }

  return fs.readFileSync(filePath);
};
