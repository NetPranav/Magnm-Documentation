import React from 'react';

export const topic21Content = {
  description: "Sending structured messages back and forth between Node.js processes.",
  paragraphs: [
    <p key="1">
      We've learned how to spawn a child process and read its raw binary output via Streams (<code>stdout</code>). But what if you are spawning another <em>Node.js</em> process, and you want to send structured JSON data or complex commands back and forth?
    </p>,
    <p key="2">
      You can use <code>child_process.fork()</code>. Forking is a special version of <code>spawn</code> specifically designed for running Node.js scripts. It automatically establishes an <strong>Inter-Process Communication (IPC)</strong> channel.
    </p>,
    <p key="3">
      With an IPC channel open, the main process and the child process can send messages to each other using <code>process.send(message)</code> and listen for messages using <code>process.on('message', callback)</code>, just like Event Emitters!
    </p>
  ],
  basicExample: `// --- main.js ---
const { fork } = require('child_process');

// 1. Fork a new Node.js process
const child = fork('./child.js');

// 2. Listen for messages from the child
child.on('message', (msg) => {
  console.log('Main Process received:', msg);
});

// 3. Send a message to the child
child.send({ command: 'START_CALCULATION', data: 42 });

// --- child.js ---
process.on('message', (msg) => {
  console.log('Child Process received:', msg);
  
  if (msg.command === 'START_CALCULATION') {
    // Do heavy math...
    const result = msg.data * 2;
    
    // Send the result back to the parent
    process.send({ status: 'DONE', result: result });
  }
});`,
  advancedTitle: "Real-World: Offloading CPU-Heavy Tasks",
  advancedParagraphs: [
    <p key="1">
      Because Node.js is single-threaded, if you try to perform a massive mathematical calculation (like generating a massive PDF report or hashing millions of passwords), it will block the Event Loop. Your web server will freeze and ignore all other users until the calculation finishes.
    </p>,
    <p key="2">
      To fix this, we can <strong>offload</strong> the heavy work. When a user requests a heavy report, the main web server <code>forks()</code> a child process and sends it the required data via IPC. 
    </p>,
    <p key="3">
      The child process grinds through the heavy CPU work independently. The main web server remains instantly responsive to other users. When the child finishes, it sends the report URL back to the main server via IPC, which then emails it to the user!
    </p>
  ],
  advancedExample: `// --- server.js (Main Web Server) ---
const http = require('http');
const { fork } = require('child_process');

const server = http.createServer((req, res) => {
  if (req.url === '/generate-report') {
    // Instead of blocking the server, we fork a background worker!
    const worker = fork('./report-generator.js');
    
    // Tell the worker what to do
    worker.send({ action: 'GENERATE_ANNUAL_REPORT', userId: 123 });
    
    // Wait for the worker to finish
    worker.on('message', (response) => {
      if (response.status === 'SUCCESS') {
        console.log(\`Report ready for user 123 at \${response.url}\`);
        // We could send an email here...
      }
    });

    // Immediately respond to the user!
    res.writeHead(202);
    res.end('Your report is generating in the background. We will email you.');
  }
});
server.listen(3000);`
};
