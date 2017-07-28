// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuidv1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

function broadcast(data) {
  for(let client of wss.clients) {
    client.send(JSON.stringify(data));
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function handleMessage(data) {
  const message = JSON.parse(data);
  console.log('message server: ', message);
  message.id = uuidv1();
  switch(message.type) {
  case 'postMessage':
    message.type = 'incomingMessage';
    broadcast(message);
    break;
  case 'postNotification':
    message.type = 'incomingNotification';
    broadcast(message);
    break;
  default:
    throw new Error('Unknown event type ' + message.type);
  }
}

function handleConnection(client) {
  console.log('New client connected!');
  console.log('We are at ' + wss.clients.size + ' clients!');
  const randColor = {
    type: 'userColor',
    color: getRandomColor()
  };
  console.log(randColor);
  client.send(JSON.stringify(randColor));
  const roomSize = {
    type: 'usersInRoom',
    content: `Total Users Online: ${wss.clients.size}`
  };
  client.send(JSON.stringify(roomSize));
  client.on('message', handleMessage);
}

wss.on('connection', handleConnection);


//  const message = JSON.parse(data);
//     message.id = uuidV1();
//     if (message.content[0] == "/") {
//       let parts = message.content.split(" ");
//       let cmd = parts.shift().replace("/", "");
//       switch(cmd) {
//         case 'me':
//           message.type = 'actionMessage';      
//           message.content = parts.join(' ');
//           break;
//         case 'giphy':
//           message.type = 'gifMessage';
//           let query = "";
//           let endpoint = "random";

//           if (parts.length) {
//             query = parts.join("+");
//             endpoint = "search";
//           } 

//           getGif(endpoint, query, message, wss); 
//           break;
//         default:
//           message.type = 'errorMessage';
//           message.content = 'Invalid command';
//       }
//     } else {
//       message.type = 'textMessage';
//     }
//     //Don't want it to send here if it's a gif, getGif will send it
//     if (message.type != 'gifMessage') {
//       wss.broadcast(JSON.stringify(message));
//     }


//     //Our custom callback functions for handling Giphy data
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
//     let url = "http://api.giphy.com/v1/gifs/random?api_key=2666876f73f549b9a8ac8bbc3c67bc6a&rating=pg";
//     request(url, function(err, response, body) {
//       body = JSON.parse(body);
//       handleRandom(body, message, wss);
//     });
//   }
// }
