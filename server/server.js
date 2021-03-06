
const express = require('express');
const SocketServer = require('ws').Server;
const uuidv1 = require('uuid/v1');

const PORT = 3001;

const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

// Helper - creates random HEX code
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function broadcast(data) {
  for(let client of wss.clients) {
    client.send(JSON.stringify(data));
  }
}

function handleMessage(data) {
  const message = JSON.parse(data);
  message.id = uuidv1();
  if (message.content.charAt(0) === '/') {
    message.content = message.content.split(' ').shift().replace('/', '');
    message.type = 'incomingImage';
  } else {
    switch(message.type) {
    case 'postMessage':
      message.type = 'incomingMessage';
      break;
    case 'postNotification':
      message.type = 'incomingNotification';
      break;
    default:
      throw new Error('Unknown event type: ' + message.type);
    }
  }
  broadcast(message);
}

function handleConnection(client) {

  client.on('message', handleMessage);

  // Sets individual color to each user
  const randUserColor = {
    type: 'userColor',
    color: getRandomColor()
  };
  client.send(JSON.stringify(randUserColor));
  
  // Gets number of active users
  const roomSize = {
    type: 'usersInRoom',
    content: `Total Users Online: ${wss.clients.size}`
  };
  broadcast(roomSize);

  client.on('close', () => {
    const roomSize = {
      type: 'usersInRoom',
      content: `Total Users Online: ${wss.clients.size}`
    };
    broadcast(roomSize);
  });
}

wss.on('connection', handleConnection);
