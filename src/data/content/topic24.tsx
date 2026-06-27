import React from 'react';

export const topic24Content = {
  description: "Keeping your Node.js application alive even when critical errors occur.",
  paragraphs: [
    <p key="1">
      Because Node.js runs on a single main thread, a single unhandled exception (like a typo in a variable name or a network timeout) will crash the entire process. If you don't handle this, your web server will shut down completely and all your users will be kicked off.
    </p>,
    <p key="2">
      To prevent this, Node.js provides global event listeners on the <code>process</code> object, specifically <code>'uncaughtException'</code> and <code>'unhandledRejection'</code>. 
    </p>,
    <p key="3">
      While you can use these events to stop the server from crashing immediately, it is highly recommended to log the error, gracefully shut down your database connections, and <strong>restart the process</strong> using a process manager like PM2. Continuing to run an application after an uncaught exception can lead to memory leaks and corrupted data!
    </p>
  ],
  basicExample: `// 1. Listen for standard synchronous errors
process.on('uncaughtException', (error) => {
  console.error("FATAL: An uncaught exception occurred!");
  console.error(error);
  
  // Clean up and exit cleanly
  process.exit(1); 
});

// 2. Listen for asynchronous Promise errors
process.on('unhandledRejection', (reason, promise) => {
  console.error("FATAL: An unhandled promise rejection occurred!");
  console.error(reason);
  
  process.exit(1);
});

// This typo will trigger the 'uncaughtException' handler
// instead of immediately crashing Node with a scary stack trace.
console.log(thisVariableDoesNotExist);`,
  advancedTitle: "Real-World: Graceful Web Server Shutdown",
  advancedParagraphs: [
    <p key="1">
      Let's look at how Enterprise applications handle crashes and restarts.
    </p>,
    <p key="2">
      If you push new code to production and restart your Node.js server, what happens to the users currently in the middle of downloading a file or submitting a form? If you just kill the process, their connections are severed and they see a "Bad Gateway" error.
    </p>,
    <p key="3">
      A <strong>Graceful Shutdown</strong> means telling the web server to stop accepting <em>new</em> connections, wait for all <em>existing</em> users to finish their downloads/requests, cleanly close the database connections, and only then exit the process.
    </p>
  ],
  advancedExample: `const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Welcome to the Enterprise App!');
});

server.listen(3000);

// Function to handle shutting down safely
function gracefulShutdown(signal) {
  console.log(\`Received \${signal}. Starting graceful shutdown...\`);
  
  // 1. Stop accepting new connections
  server.close(() => {
    console.log('Closed out remaining connections.');
    
    // 2. Close database connections (mocked here)
    // database.disconnect().then(() => {
    
    console.log('Database disconnected. Exiting cleanly.');
    process.exit(0);
  });

  // 3. Force shutdown if existing connections take too long (e.g. 10s)
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

// Triggered when you press Ctrl+C
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Triggered by hosting providers (like Heroku/Render) when they restart your app
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));`,
  quiz: {
    title: "Module IV: Multi-Processing & IPC Quiz",
    questions: [
      {
        question: "What is the core difference between `spawn` and `exec`?",
        options: [
          "`exec` streams data, `spawn` buffers data into a single string",
          "`spawn` returns streams for huge outputs, `exec` buffers all output into a string and can crash on massive outputs",
          "`spawn` only works on Windows",
          "There is no difference"
        ],
        correctAnswerIndex: 1,
        explanation: "`exec` waits for the command to finish and buffers the entire output into RAM, which crashes if the output is huge. `spawn` uses streams to handle massive data safely."
      },
      {
        question: "How do two distinct Node.js child processes communicate with each other?",
        options: [
          "Through shared memory spaces",
          "By writing to a temporary file",
          "Using Inter-Process Communication (IPC) via `process.send()` and `process.on('message')`",
          "They cannot communicate"
        ],
        correctAnswerIndex: 2,
        explanation: "When you fork a process, Node.js establishes an IPC channel allowing you to pass serialized JSON messages back and forth."
      },
      {
        question: "What is a major advantage of Worker Threads over Child Processes?",
        options: [
          "Worker Threads can share memory (using SharedArrayBuffer) avoiding JSON serialization overhead",
          "Worker Threads run on the GPU",
          "Worker Threads are asynchronous",
          "Worker Threads bypass the OS kernel"
        ],
        correctAnswerIndex: 0,
        explanation: "Worker Threads can actually share the same memory buffer (SharedArrayBuffer), meaning you don't have to stringify/parse huge data sets when passing them between threads."
      },
      {
        question: "Why should you listen for `uncaughtException` and `SIGTERM`?",
        options: [
          "To keep the server running forever, ignoring all errors",
          "To gracefully shut down connections, close databases, and exit cleanly so clients don't hang indefinitely",
          "To restart the server automatically",
          "To clear the V8 garbage collector"
        ],
        correctAnswerIndex: 1,
        explanation: "A graceful shutdown ensures that users who are currently downloading files or saving data are not abruptly disconnected."
      }
    ]
  }
};
