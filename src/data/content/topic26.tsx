import React from 'react';

export const topic26Content = {
  description: "Building your own low-level network server.",
  difficulty: "Advanced" as const,
  paragraphs: [
    <p key="1">
      In the previous topic, we looked at how to act as a <em>Client</em> and connect to an existing TCP server. Now, let's look at how to build the <em>Server</em> itself.
    </p>,
    <p key="2">
      A TCP server is a process that binds to a specific port on your machine and continuously listens for incoming connections. When a client connects, the server emits a <code>'connection'</code> event, providing a dedicated Socket object for that specific client.
    </p>,
    <p key="3">
      TCP is stateful. Unlike standard HTTP where the server forgets about you immediately after sending a response, a TCP socket remains open indefinitely. The server and the client can send data back and forth freely until one of them decides to close the connection.
    </p>
  ],
  basicExample: `const net = require('net');

// 1. Create the TCP Server
const server = net.createServer((socket) => {
  // This callback runs every time a NEW client connects
  console.log('A new client connected!');
  
  // 2. Send a welcome message
  socket.write('Welcome to the raw TCP server!\\n');
  
  // 3. Listen for data from this specific client
  socket.on('data', (data) => {
    console.log('Client says:', data.toString());
    
    // Echo it back in uppercase
    socket.write(data.toString().toUpperCase());
  });
  
  // 4. Handle client disconnection
  socket.on('end', () => {
    console.log('Client disconnected.');
  });
});

// 5. Start listening on port 8080
server.listen(8080, () => {
  console.log('TCP Server listening on port 8080');
});`,
  advancedTitle: "Real-World: A Multiplayer Game Server",
  advancedParagraphs: [
    <p key="1">
      Why would you build a raw TCP server instead of a standard HTTP API? <strong>Speed and State.</strong>
    </p>,
    <p key="2">
      Imagine you are building a real-time multiplayer game like World of Warcraft. If players had to send a brand new HTTP request every time their character moved 1 pixel, the overhead of establishing a new connection and sending HTTP headers would cause massive lag.
    </p>,
    <p key="3">
      Instead, game clients establish a single, persistent TCP connection to the game server. The server keeps an array of all active player sockets in memory, and instantly broadcasts tiny, highly-optimized binary payloads (like player coordinates) to everyone in real-time.
    </p>
  ],
  advancedExample: `const net = require('net');

// Keep track of all connected players
const players = new Set();

const gameServer = net.createServer((socket) => {
  players.add(socket);
  console.log(\`Player joined. Total online: \${players.size}\`);
  
  socket.on('data', (data) => {
    // In a real game, this data would be parsed as a binary buffer
    // containing coordinates, health, and actions.
    const playerAction = data.toString();
    
    // Broadcast the action to ALL OTHER players instantly
    for (const player of players) {
      if (player !== socket) {
        player.write(\`Enemy moved: \${playerAction}\`);
      }
    }
  });

  socket.on('close', () => {
    players.delete(socket);
    console.log(\`Player left. Total online: \${players.size}\`);
  });
});

// gameServer.listen(9000);`
};
