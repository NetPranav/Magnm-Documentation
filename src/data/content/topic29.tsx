import React from 'react';

export const topic29Content = {
  description: "Implementing a WebSocket server using the 'ws' library.",
  difficulty: "Intermediate" as const,
  paragraphs: [
    <p key="1">
      While Node.js has a built-in <code>http</code> module, it does <em>not</em> have a built-in WebSocket module. To build a WebSocket server, the community relies on the incredibly fast and lightweight third-party library called <strong><code>ws</code></strong>.
    </p>,
    <p key="2">
      The <code>ws</code> library hooks into your standard HTTP server. When an HTTP request comes in requesting an "upgrade", the <code>ws</code> library intercepts it, performs the complex cryptographic handshake required by the WebSocket protocol, and gives you a clean API to send and receive messages.
    </p>,
    <p key="3">
      Let's look at how to build a basic echo server where multiple clients can connect and talk to the server in real-time.
    </p>
  ],
  basicExample: `// 1. Install the library: npm install ws
const { WebSocketServer } = require('ws');

// 2. Start the WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });

// 3. Listen for new client connections
wss.on('connection', function connection(ws) {
  console.log("A new client connected!");

  // Send a welcome message to this specific client
  ws.send('Welcome to the WebSocket server!');

  // Listen for messages from this specific client
  ws.on('message', function incoming(message) {
    console.log('Received: %s', message);
    
    // Echo the message back to the client
    ws.send(\`Echo: \${message}\`);
  });
  
  // Handle disconnection
  ws.on('close', () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket Server running on ws://localhost:8080");`,
  advancedTitle: "Real-World: A Broadcast Chat Room",
  advancedParagraphs: [
    <p key="1">
      In a real chat application, when one user sends a message, you don't just want to echo it back to them—you want to broadcast it to <em>everyone else</em> in the room.
    </p>,
    <p key="2">
      The <code>WebSocketServer</code> instance keeps track of all currently active client connections in a Set called <code>wss.clients</code>. We can simply loop through this Set and send the message to everyone whose connection is currently open!
    </p>
  ],
  advancedExample: `const { WebSocketServer, WebSocket } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  
  ws.on('message', function incoming(message) {
    console.log('Received message, broadcasting to all clients');
    
    // Loop through ALL connected clients
    wss.clients.forEach(function each(client) {
      
      // If the client is open, AND it's NOT the person who sent the message
      if (client.readyState === WebSocket.OPEN && client !== ws) {
        
        // Send the message to them!
        client.send(message.toString());
        
      }
    });
  });
});`
};
