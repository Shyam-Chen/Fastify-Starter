import fs from 'fs';
import path from 'path';

export default (file: string) => {
  let filePath = '';

  if (process.env.NODE_ENV === 'development') {
    filePath = path.resolve(process.cwd() + file.replace('/@fs', ''));
  }

  if (process.env.NODE_ENV === 'production') {
    filePath = path.resolve(`${process.cwd()}/dist${file}`);
  }

  return fs.readFileSync(filePath);
};
