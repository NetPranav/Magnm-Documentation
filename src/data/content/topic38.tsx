import React from 'react';

export const topic38Content = {
  description: "Finding out why your server is crashing in production.",
  difficulty: "Advanced" as const,
  paragraphs: [
    <p key="1">
      JavaScript is a garbage-collected language, which means V8 automatically frees up memory when variables are no longer needed. However, <strong>Memory Leaks</strong> still happen constantly in Node.js.
    </p>,
    <p key="2">
      A memory leak occurs when you accidentally keep a reference to an object that you don't need anymore. Because you still have a reference to it (e.g., inside an array or a global cache object), V8's Garbage Collector assumes you still need it and refuses to delete it.
    </p>,
    <p key="3">
      Over hours or days, your server's RAM usage slowly creeps up until it hits the V8 heap limit (default ~1.4GB) and crashes with the dreaded <code>FATAL ERROR: JavaScript heap out of memory</code>.
    </p>
  ],
  basicExample: `// The classic Memory Leak
const express = require('express');
const app = express();

// A global array that grows forever
const activeUsersCache = [];

app.get('/login', (req, res) => {
  const userSession = {
    id: Math.random(),
    data: new Array(10000).fill('User Data') // Takes up significant memory
  };
  
  // We add the user to the cache, but WE NEVER REMOVE THEM!
  activeUsersCache.push(userSession);
  
  res.send('Logged in');
});

// If 10,000 people hit this route, the server will crash
app.listen(3000);`,
  advancedTitle: "Real-World: Profiling with Chrome DevTools",
  advancedParagraphs: [
    <p key="1">
      When a production server is leaking memory, how do you find the exact line of code causing it? You use the built-in V8 Inspector and Chrome DevTools.
    </p>,
    <p key="2">
      You can start your Node server with the <code>--inspect</code> flag. This opens a debugging port that you can connect to using your Google Chrome browser (type <code>chrome://inspect</code> in the URL bar).
    </p>,
    <p key="3">
      Once connected, you take a <strong>Heap Snapshot</strong> (a frozen picture of every variable in RAM). You wait 10 minutes, take another Heap Snapshot, and compare them. Chrome will highlight exactly which objects grew in size, pointing you directly to the leaking array!
    </p>
  ],
  advancedExample: `// 1. Start your server in inspect mode:
// node --inspect index.js

// 2. Open Google Chrome and go to:
// chrome://inspect

// 3. Click "Open dedicated DevTools for Node"

// 4. Go to the "Memory" tab and click "Take snapshot"

// 5. Simulate traffic using a load testing tool like Apache Benchmark:
// ab -n 1000 -c 100 http://localhost:3000/login

// 6. Take a second snapshot and use the "Comparison" view to find the leak!`
};
