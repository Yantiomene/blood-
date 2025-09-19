const express = require('express');
const http = require('http');
const { WebSocket } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const connectedClients = new Map(); // Set to store connected clients

wss.on('connection', (ws) => {
  console.log('Client connected');
  connectedClients.set(ws, {}); // Add the new client to the map

  ws.on('message', (message) => {
    const messageStr = message.toString().trim();
    if (!messageStr) return; // Ignore empty messages

    console.log('Received message:', messageStr);

    // Broadcast message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) { // 1 = OPEN
        client.send(messageStr);
        console.log('Sent message:', messageStr);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    connectedClients.delete(ws); // Remove the disconnected client from the set
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
