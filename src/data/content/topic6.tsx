import React from 'react';

export const topic6Content = {
  description: "Mastering Promises, Async/Await, and executing tasks in parallel.",
  imageUrl: "/assets/images/async-patterns-v2.png",
  imageAlt: "Sequential vs Parallel Execution Diagram",
  paragraphs: [
    <p key="1">
      When dealing with asynchronous tasks (like reading files or making network requests), the way you structure your code drastically impacts the performance of your Node.js application.
    </p>,
    <p key="2">
      In older versions of Node.js, asynchronous operations relied on <strong>Callbacks</strong>. While fast, this led to "Callback Hell"—deeply nested code that was impossible to read or debug. Today, we use <strong>Promises</strong> and the <code>async/await</code> syntax. A Promise is simply an object that represents the eventual completion (or failure) of an asynchronous operation.
    </p>,
    <p key="3">
      The most critical mistake developers make with <code>async/await</code> is accidentally forcing tasks to run sequentially. If you need to read 3 independent files, waiting for File 1 to finish before starting File 2 wastes time. Instead, you should start all 3 reads simultaneously and wait for them to finish in <strong>Parallel</strong>.
    </p>
  ],
  basicExample: `// ❌ SEQUENTIAL (Slow)
async function getSlowData() {
  const user = await fetchUser();         // Takes 1 second
  const posts = await fetchPosts();       // Takes 1 second
  return { user, posts };                 // Total: 2 seconds
}

// ✅ PARALLEL (Fast)
async function getFastData() {
  // We start both promises at the exact same time
  const [user, posts] = await Promise.all([
    fetchUser(),  // Takes 1 second
    fetchPosts()  // Takes 1 second
  ]);
  return { user, posts };                 // Total: 1 second!
}`,
  advancedTitle: "Real-World: Parallel Sync Verification",
  advancedParagraphs: [
    <p key="1">
      Let's apply this to our <strong>Real-time P2P File Sync Engine</strong>.
    </p>,
    <p key="2">
      When our engine boots up, it needs to verify the cryptographic hashes of every file in the workspace to see if anything changed while it was offline. If a user has 1,000 files, hashing them sequentially one-by-one would take minutes.
    </p>,
    <p key="3">
      By using <code>Promise.all()</code>, we can fire off 1,000 hashing operations simultaneously. Libuv will distribute the actual file reading across its internal C++ thread pool (which defaults to 4 threads), cutting the boot time down to just a few seconds!
    </p>
  ],
  advancedExample: `const crypto = require('crypto');
const fs = require('fs/promises');

// Inside our File Sync Engine...
async function verifyWorkspaceHashes(files) {
  console.log(\`Verifying \${files.length} files in parallel...\`);

  // We map the array of files into an array of Promises
  const hashingPromises = files.map(async (file) => {
    const data = await fs.readFile(file.path);
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    
    return { path: file.path, hash: hash };
  });

  // We wait for ALL 1,000 promises to finish simultaneously!
  const results = await Promise.all(hashingPromises);
  
  console.log("Workspace verified instantly!");
  return results;
}`,
  extraExamples: [
    {
      title: "Edge Case: Promise.race for Timeouts",
      paragraphs: [
        <p key="1">
          Sometimes you don't want to wait for all promises to finish. What if you're trying to connect to a WebRTC peer, but they might be offline? You don't want your engine to hang forever. You can use <code>Promise.race()</code> to pit your connection attempt against a 5-second timer. Whichever promise finishes first "wins" the race!
        </p>
      ],
      code: `// Inside our File Sync Engine...

async function connectWithTimeout(peerId) {
  // Promise 1: The actual connection attempt
  const connectionTask = connectToPeer(peerId);

  // Promise 2: A timer that rejects after 5 seconds
  const timeoutTask = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Connection Timed Out!')), 5000);
  });

  try {
    // If connectionTask takes longer than 5s, timeoutTask wins and throws!
    const peer = await Promise.race([connectionTask, timeoutTask]);
    console.log(\`Successfully connected to \${peerId}\`);
  } catch (error) {
    console.error(error.message);
    // Fallback: Try a different peer or show offline mode UI
  }
}`
    }
  ],
  quiz: {
    title: "Module I: Core Execution & Event Loop Quiz",
    questions: [
      {
        question: "What two technologies make up the core of Node.js?",
        options: ["React and Express", "V8 Engine and Libuv", "Chrome and Webpack", "npm and Yarn"],
        correctAnswerIndex: 1,
        explanation: "Node.js is built on Google's V8 JavaScript Engine (for executing JS) and Libuv (for the Event Loop, threads, and async I/O)."
      },
      {
        question: "What does process.nextTick() do?",
        options: [
          "Pauses the Event Loop for 1 tick",
          "Schedules a callback at the END of the current Event Loop iteration",
          "Schedules a callback BEFORE any other pending I/O or timers in the current phase",
          "Kills the Node.js process"
        ],
        correctAnswerIndex: 2,
        explanation: "process.nextTick() fires its callback before any pending I/O events or timers, giving it higher priority than setImmediate() or setTimeout()."
      },
      {
        question: "Which async pattern allows you to run multiple promises concurrently and wait for ALL of them?",
        options: ["Promise.race()", "Promise.any()", "Promise.all()", "async/await"],
        correctAnswerIndex: 2,
        explanation: "Promise.all() takes an array of Promises and resolves only when ALL of them have resolved, or rejects as soon as any one of them fails."
      },
      {
        question: "What triggers the V8 Garbage Collector to free memory?",
        options: [
          "Calling process.exit()",
          "When a variable goes out of scope and has no remaining references",
          "Every 10 seconds automatically",
          "When you call gc.collect()"
        ],
        correctAnswerIndex: 1,
        explanation: "V8's Garbage Collector automatically frees memory when objects are no longer reachable — meaning no variable or closure references them anymore."
      }
    ]
  }
};
