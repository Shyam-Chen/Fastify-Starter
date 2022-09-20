const WebSocket = require('ws')

const client = new WebSocket('ws://localhost:3000/ws');

client.on('open', () => {
  client.send('Hello, RealtimeData!');
});

client.onmessage = event => {
  console.log(event.data);
};
