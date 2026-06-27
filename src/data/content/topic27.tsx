import React from 'react';

export const topic27Content = {
  description: "How Node.js translates raw TCP into HTTP.",
  difficulty: "Intermediate" as const,
  paragraphs: [
    <p key="1">
      We've seen that the <code>net</code> module handles raw TCP connections. The <code>http</code> module is essentially a wrapper built directly on top of the <code>net</code> module!
    </p>,
    <p key="2">
      When a web browser connects to your <code>http.createServer</code>, Node.js first accepts the raw TCP connection using the <code>net</code> module. It then reads the incoming stream of binary data and looks for specific text patterns defined by the HTTP protocol (like <code>GET / HTTP/1.1</code>).
    </p>,
    <p key="3">
      Node's internal HTTP parser takes this messy string data, parses it, and neatly packages it into the <code>request</code> object. It also gives you a <code>response</code> object, which is actually just a Writable Stream that formats your output back into a valid HTTP string before sending it over the TCP socket.
    </p>
  ],
  basicExample: `// This is what the HTTP module does behind the scenes!
const net = require('net');

const mockHttpServer = net.createServer((socket) => {
  socket.on('data', (data) => {
    const requestString = data.toString();
    console.log("Raw HTTP Request Received:\\n", requestString);
    
    // We must manually construct a valid HTTP response string
    const body = "<h1>Hello from Raw TCP!</h1>";
    const response = 
      "HTTP/1.1 200 OK\\r\\n" + 
      "Content-Type: text/html\\r\\n" + 
      "Content-Length: " + body.length + "\\r\\n" + 
      "\\r\\n" + // Blank line separates headers from body
      body;
      
    // Send it back and immediately close the connection 
    // (because standard HTTP is stateless)
    socket.write(response);
    socket.end();
  });
});

// mockHttpServer.listen(3000);`,
  advancedTitle: "Real-World: HTTP Keep-Alive",
  advancedParagraphs: [
    <p key="1">
      Because establishing a brand new TCP connection takes time (the TCP 3-way handshake), modern browsers use a feature called <strong>HTTP Keep-Alive</strong>.
    </p>,
    <p key="2">
      When you load a webpage, the browser needs to fetch the HTML file, the CSS file, the JavaScript file, and maybe 10 images. Instead of opening 13 separate TCP connections, it asks the server to keep the initial TCP connection open (Keep-Alive) and reuses it to send the subsequent HTTP requests! Node's <code>http</code> module handles all of this socket reuse automatically.
    </p>
  ],
  advancedExample: `const http = require('http');

// A standard HTTP Agent manages connection pooling and Keep-Alive
const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 10, // Max simultaneous open TCP connections per host
  keepAliveMsecs: 1000 // How long to keep a socket open waiting for new requests
});

// If you make multiple requests to the same server using this agent,
// Node.js will reuse the underlying TCP socket instead of creating a new one!
// http.get({ hostname: 'api.example.com', agent: agent }, (res) => { ... });`
};
