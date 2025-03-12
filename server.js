// filepath: /Users/ali/Desktop/code/projects_js/itrimedia_pos/server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Create HTTP server to serve client-side files
const httpServer = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (req.method === 'GET' && req.url === '/admin') {
    fs.readFile(path.join(__dirname, 'admin.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading admin.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Start HTTP server
httpServer.listen(3000, () => {
  console.log('HTTP server is running on http://localhost:3000');
});

// Create WebSocket server
const wsServer = new WebSocket.Server({ server: httpServer });

wsServer.on('connection', (ws) => {
  console.log('New client connected');

  // Handle incoming messages from the client
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    // Broadcast the message to all connected clients
    wsServer.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:3000');