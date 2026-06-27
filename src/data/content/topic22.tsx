import React from 'react';

export const topic22Content = {
  description: "Achieving true multithreading and parallel execution within a single Node.js process.",
  imageUrl: "/assets/images/worker-threads.png",
  imageAlt: "Node.js Worker Threads Architecture Diagram",
  paragraphs: [
    <p key="1">
      You might have heard the famous phrase: <em>"Node.js is single-threaded."</em> While true for the main Event Loop, modern Node.js provides true multithreading via the <code>worker_threads</code> module.
    </p>,
    <p key="2">
      Unlike <code>child_process.fork()</code> (which spins up entirely separate Operating System processes that consume ~30MB of RAM each), Worker Threads share the same OS process. They are incredibly lightweight, spinning up independent V8 Engine instances that can run JavaScript in parallel!
    </p>,
    <p key="3">
      Workers communicate with the main thread (or each other) using a <code>MessageChannel</code>. Because they live inside the same OS process, they can even share the exact same blocks of memory (using <code>SharedArrayBuffer</code>), which is impossible with standard child processes!
    </p>
  ],
  basicExample: `// --- main.js ---
const { Worker } = require('worker_threads');

// 1. Spin up a lightweight worker thread
const worker = new Worker('./worker.js');

// 2. Listen for messages from the worker
worker.on('message', (msg) => {
  console.log('Main thread received:', msg);
});

// 3. Send data to the worker
worker.postMessage({ command: 'HELLO' });


// --- worker.js ---
const { parentPort } = require('worker_threads');

// 1. Listen for messages from the main thread
parentPort.on('message', (msg) => {
  if (msg.command === 'HELLO') {
    // 2. Send a response back
    parentPort.postMessage('Hello from the parallel universe!');
  }
});`,
  advancedTitle: "Real-World: Image Resizing Microservice",
  advancedParagraphs: [
    <p key="1">
      Let's look at a highly CPU-intensive real-world task: <strong>Image Processing</strong>.
    </p>,
    <p key="2">
      If 1,000 users upload 4K avatars at the exact same time, and your main Event Loop tries to resize all of them to 100x100 thumbnails, your Node.js server will completely freeze. No one else will be able to log in or view the website until the resizing is done.
    </p>,
    <p key="3">
      To solve this, we implement a <strong>Worker Pool</strong>. When an image needs resizing, we hand it off to a Worker Thread. The worker uses its own CPU core to do the heavy mathematical matrix transformations required for image resizing, leaving the main Event Loop completely free to serve new users!
    </p>
  ],
  advancedExample: `const { Worker } = require('worker_threads');
const http = require('http');

// A simple web server that resizes images on demand
const server = http.createServer((req, res) => {
  if (req.url === '/upload-avatar') {
    
    // Instead of freezing the server, we spin up a Worker Thread!
    // We pass the image path as initial data (workerData)
    const worker = new Worker('./resize-worker.js', {
      workerData: { imagePath: './massive_upload.jpg' }
    });
    
    // When the worker finishes resizing using its own CPU core...
    worker.on('message', (result) => {
      res.writeHead(200);
      res.end(\`Success! Thumbnail saved at \${result.thumbnailPath}\`);
    });
    
    worker.on('error', (err) => {
      res.writeHead(500);
      res.end('Failed to resize image.');
    });

  } else {
    // Other users can still access the homepage instantly!
    res.end('Welcome to the homepage!');
  }
});

server.listen(3000);`
};
