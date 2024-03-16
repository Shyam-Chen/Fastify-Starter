import process from 'node:process';
import { parentPort } from 'node:worker_threads';

console.log('Hello, Bree!');

if (parentPort) {
  parentPort.postMessage('done');
} else {
  process.exit(0);
}
