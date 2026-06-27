import React from 'react';

export const topic0dContent = {
  description: "Getting 'Hello World' onto the screen.",
  difficulty: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
  paragraphs: [
    <p key="1">
      While you can build CLI tools and automation scripts with Node.js, it is most famous for building blazing-fast Web Servers.
    </p>,
    <p key="2">
      A web server is simply a long-running Node.js process that listens to a specific "Port" (like a doorway) on your computer's network interface. When a web browser knocks on that port (sends an HTTP Request), your Node script wakes up, runs some logic, and sends back an HTTP Response (usually HTML or JSON data).
    </p>,
    <p key="3">
      Node.js has a built-in module called <code>http</code> that gives you everything you need to build a web server from scratch without installing any third-party libraries!
    </p>
  ],
  basicExample: `// 1. Import the built-in HTTP module
const http = require('http');

// 2. Create the server
const server = http.createServer((request, response) => {
  // This function runs EVERY time a user visits the website!
  
  // Set the response status and headers
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  
  // Send the body and end the connection
  response.end('Hello World from Node.js!');
});

// 3. Tell the server to start listening on port 3000
server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});`,
  miniProject: {
    title: "The Hello World Web Server",
    description: (
      <>
        <p>
          <strong>Goal:</strong> Build a basic HTTP server that responds with different messages depending on the URL the user visits.
        </p>
        <p>
          Inside the <code>createServer</code> callback, check the value of <code>request.url</code>. If it equals <code>'/'</code>, respond with "Welcome to the Homepage". If it equals <code>'/api'</code>, respond with a JSON string. For anything else, respond with a 404 error.
        </p>
      </>
    ),
    code: `const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to the Homepage!');
  } 
  else if (req.url === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Hello JSON!", status: "success" }));
  } 
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(3000, () => console.log('Listening on port 3000...'));`
  }
};
