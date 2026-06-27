import React from 'react';

export const topic23Content = {
  description: "Using SharedArrayBuffer to avoid expensive memory copying across threads.",
  paragraphs: [
    <p key="1">
      In the previous topic, we used <code>postMessage()</code> to send data between Worker Threads. Under the hood, this uses an algorithm called the <em>Structured Clone Algorithm</em> to physically copy the data from the main thread's memory into the worker's memory.
    </p>,
    <p key="2">
      If you are sending a massive 5GB Video Buffer to a worker thread for processing, cloning it will double your memory usage to 10GB and take a very long time just to copy the bytes!
    </p>,
    <p key="3">
      The solution is <strong>SharedArrayBuffer</strong>. Instead of copying the memory, you pass a reference to the exact same block of physical RAM. Both the main thread and the worker thread can read and write to this block simultaneously.
    </p>
  ],
  basicExample: `// --- main.js ---
const { Worker } = require('worker_threads');

// 1. Allocate 4 bytes of shared memory
const sharedBuffer = new SharedArrayBuffer(4);
const sharedArray = new Int32Array(sharedBuffer);

// 2. Set the first number to 42
sharedArray[0] = 42;

// 3. Pass the buffer to the worker (NO COPYING HAPPENS!)
const worker = new Worker('./worker.js', { 
  workerData: sharedBuffer 
});

worker.on('message', () => {
  // 5. The worker changed the memory directly!
  console.log('Value after worker:', sharedArray[0]); // Prints: 100
});


// --- worker.js ---
const { workerData, parentPort } = require('worker_threads');

// 4. Access the EXACT same memory block
const sharedArray = new Int32Array(workerData);
sharedArray[0] = 100;

parentPort.postMessage('Done');`,
  advancedTitle: "Real-World: Real-Time Audio Mixing",
  advancedParagraphs: [
    <p key="1">
      Let's look at a scenario where milliseconds matter: <strong>Real-Time Audio Mixing</strong>.
    </p>,
    <p key="2">
      Imagine you are building a Node.js server that mixes audio streams from 10 different users in a live Discord-style voice chat. You have 10 Worker Threads (one for each user's incoming audio).
    </p>,
    <p key="3">
      Instead of constantly copying audio buffers back and forth, you allocate a single, massive <code>SharedArrayBuffer</code> representing the final mixed audio output. All 10 Worker Threads simultaneously write their processed audio data directly into this shared memory block. The main thread then simply streams that shared memory straight to the network!
    </p>
  ],
  advancedExample: `const { Worker } = require('worker_threads');

// A highly simplified representation of a Voice Chat Mixer

// 1. Create a 1MB Shared Audio Buffer for the final mix
const sharedAudioBuffer = new SharedArrayBuffer(1024 * 1024);

const users = ['Alice', 'Bob', 'Charlie'];
let activeWorkers = 0;

// 2. Spin up a dedicated Worker for each user
for (const user of users) {
  activeWorkers++;
  const worker = new Worker('./audio-processor-worker.js', {
    // Pass the shared memory so all workers write to the same place
    workerData: { user, sharedAudioBuffer }
  });

  worker.on('message', (msg) => {
    if (msg === 'MIX_COMPLETE') {
      activeWorkers--;
      if (activeWorkers === 0) {
        // 3. When all workers finish writing, broadcast the shared buffer!
        console.log('All audio mixed! Broadcasting SharedArrayBuffer...');
        // broadcastToNetwork(sharedAudioBuffer);
      }
    }
  });
}`
};
