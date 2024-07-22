import process from 'node:process';
import { parentPort } from 'node:worker_threads';

console.log('Hello, World!');

if (parentPort) {
  parentPort.postMessage('done');
} else {
  process.exit(0);
}
