import React from 'react';

export const topic39Content = {
  description: "Tracking the exact lifetime of asynchronous resources.",
  difficulty: "Advanced" as const,
  paragraphs: [
    <p key="1">
      When you receive an HTTP request, you might query a database, wait for a cache response, and then send a reply. In synchronous languages like Python or Ruby, all of this happens on a single Thread. You can easily attach a "Request ID" to the thread context to track logs for that specific request.
    </p>,
    <p key="2">
      In Node.js, there is no Thread Context! A single thread is juggling 10,000 HTTP requests simultaneously via the Event Loop. If a database query fails 3 seconds later in a random callback, how do you know <em>which</em> of the 10,000 HTTP requests triggered it?
    </p>,
    <p key="3">
      The <strong><code>async_hooks</code></strong> module solves this. It hooks deeply into the V8 runtime and assigns a unique ID (ExecutionAsyncId) to every single asynchronous operation. It allows you to trace the exact lineage of callbacks across the Event Loop.
    </p>
  ],
  basicExample: `const async_hooks = require('async_hooks');
const fs = require('fs');

// Create a hook that fires every time a NEW async operation begins
const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    // We must use fs.writeSync to log data here. 
    // If we used console.log (which is async), we would trigger an infinite loop of async hooks!
    fs.writeSync(1, \`Init: \${type} (ID: \${asyncId}) triggered by (ID: \${triggerAsyncId})\\n\`);
  }
});

hook.enable();

// Trigger an async operation
setTimeout(() => {
  fs.writeSync(1, 'Timeout finished!\\n');
}, 10);`,
  advancedTitle: "Real-World: AsyncLocalStorage",
  advancedParagraphs: [
    <p key="1">
      Writing raw <code>async_hooks</code> is incredibly dangerous (it can destroy performance). Thankfully, Node.js provides a high-level utility built on top of it called <strong><code>AsyncLocalStorage</code></strong>.
    </p>,
    <p key="2">
      <code>AsyncLocalStorage</code> allows you to create a "store" of data (like a Request ID) that automatically persists across all async callbacks, promises, and timeouts that originated from that specific HTTP request. It gives Node.js the equivalent of Thread-Local Storage!
    </p>
  ],
  advancedExample: `const { AsyncLocalStorage } = require('async_hooks');
const http = require('http');

const asyncLocalStorage = new AsyncLocalStorage();

function logWithRequestId(msg) {
  // Automatically pulls the ID from the magic async context!
  const id = asyncLocalStorage.getStore();
  console.log(\`[\${id}] \${msg}\`);
}

http.createServer((req, res) => {
  const requestId = Math.random().toString(36).substr(2, 9);
  
  // Wrap the entire request in the Async Context
  asyncLocalStorage.run(requestId, () => {
    
    logWithRequestId('Started processing request');
    
    setTimeout(() => {
      // Even after an async jump, it still knows the Request ID!
      logWithRequestId('Database query finished');
      res.end('Done');
    }, 100);
    
  });
}).listen(3000);`
};
