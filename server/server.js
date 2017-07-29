
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


// function handleSearch(results, message, wss) {
//   let gif = results.data[0];
//   message.content = gif.images.fixed_height.url;
//   wss.broadcast(JSON.stringify(message));
// }

// function handleRandom(results, message, wss) {
//   message.content = results.data.image_url;
//   wss.broadcast(JSON.stringify(message));
// }

// function getGif(endpoint, query, message, wss) {
//   if (endpoint == 'search') {
//     let url = `http://api.giphy.com/v1/gifs/search?api_key=2666876f73f549b9a8ac8bbc3c67bc6a&rating=pg&q=${query}`;
//     request(url, function(err, response, body) {
//       body = JSON.parse(body);
//       handleSearch(body, message, wss);
//     });
//   } else {
//     let url = 'http://api.giphy.com/v1/gifs/random?api_key=2666876f73f549b9a8ac8bbc3c67bc6a&rating=pg';
//     request(url, function(err, response, body) {
//       body = JSON.parse(body);
//       handleRandom(body, message, wss);
//     });
//   }
// }


// ws.on('message', (data) => {
//   const message = JSON.parse(data);
//   message.id = uuidV1();
//   if (message.content[0] == '/') {
//     let parts = message.content.split(' ');
//     let cmd = parts.shift().replace('/', ');
//     switch(cmd) {
//     case 'me':
//       message.type = 'actionMessage';
//       message.content = parts.join(' ');
//       break;
//     case 'giphy':
//       message.type = 'gifMessage';
//       let query = ';
//       let endpoint = 'random';

//       if (parts.length) {
//         query = parts.join('+');
//         endpoint = 'search';
//       }

//       getGif(endpoint, query, message, wss);
//       break;
//     default:
//       message.type = 'errorMessage';
//       message.content = 'Invalid command';
//     }
//   } else {
//     message.type = 'textMessage';
//   }
//   //Don't want it to send here if it's a gif, getGif will send it
//   if (message.type != 'gifMessage') {
//     wss.broadcast(JSON.stringify(message));
//   }
// });
