import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default (file: string) => {
  let filePath = '';

  if (process.env.NODE_ENV === 'development') {
    filePath = path.resolve(process.cwd(), './public', file);
  }

  if (process.env.NODE_ENV === 'production') {
    filePath = path.resolve(__dirname, '../', file);
  }

  return fs.readFileSync(filePath);
};
