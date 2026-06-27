import React from 'react';

export const topic28Content = {
  description: "Real-time, bidirectional communication in the browser.",
  difficulty: "Beginner" as const,
  paragraphs: [
    <p key="1">
      We just learned that HTTP is stateless and request-driven. The client asks for data, the server replies, and the connection is generally closed (or kept alive just for the next request). The server <em>cannot</em> spontaneously push data to the client!
    </p>,
    <p key="2">
      But what if you are building a Chat App or a Live Stock Ticker? You need the server to instantly push new messages to the browser without the browser having to constantly ask "Any new messages?".
    </p>,
    <p key="3">
      <strong>WebSockets</strong> solve this! A WebSocket starts as a normal HTTP request, but it asks the server to "upgrade" the connection. If the server agrees, the HTTP protocol is stripped away, and the underlying TCP socket is kept open. Now, both the browser and the server can send lightweight messages to each other instantly at any time.
    </p>
  ],
  basicExample: `// This is what WebSocket code looks like IN THE BROWSER (Client-side)

// 1. Connect to the server
const socket = new WebSocket('ws://localhost:8080');

// 2. Listen for the connection to open
socket.addEventListener('open', () => {
  console.log('Connected to server!');
  
  // Send a message to the server
  socket.send('Hello Server! I am ready.');
});

// 3. Listen for messages PUSHED from the server
socket.addEventListener('message', (event) => {
  console.log('Server says:', event.data);
});`,
  advancedTitle: "Real-World: WebSockets vs Long Polling",
  advancedParagraphs: [
    <p key="1">
      Before WebSockets were standardized, developers used a hack called <strong>Long Polling</strong> to achieve real-time features.
    </p>,
    <p key="2">
      In Long Polling, the browser sends an HTTP request to the server asking for new messages. If there are no messages, the server <em>does not reply</em>. It keeps the request hanging open for 30 seconds. If a message arrives during that time, it finally replies. The browser immediately fires off another hanging request.
    </p>,
    <p key="3">
      While Long Polling works, it wastes incredible amounts of CPU and memory keeping thousands of HTTP requests hanging open, and incurs the overhead of HTTP headers on every single message. WebSockets are vastly superior because they operate over a single, bare-bones persistent connection.
    </p>
  ],
  advancedExample: `// Long Polling (The Old Hacky Way)
// Browser: "Any messages?"
// Server: (Waits 20 seconds...) "No."
// Browser: "Any messages?"
// Server: (Waits 5 seconds...) "Yes, here is a message."
// Browser: "Any messages?"

// WebSockets (The Modern Way)
// Browser: "Let's open a WebSocket."
// Server: "Agreed."
// (Connection stays open silently with almost zero overhead)
// Server: (Spontaneously) "Here is a message!"
// Browser: (Spontaneously) "Here is a reply!"`
};
