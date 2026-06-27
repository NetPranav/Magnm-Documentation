import React from 'react';
import Link from 'next/link';

export const topic2Content = {
  description: "A deep dive into how Node.js juggles thousands of asynchronous tasks on a single thread.",
  imageUrl: "/assets/images/event-loop-v2.png",
  imageAlt: "Node.js Event Loop Architecture Diagram",
  paragraphs: [
    <p key="1">
      Node.js is famously <strong>single-threaded</strong>. This means it only has one main execution thread to process JavaScript. If it stops to wait for a file to save or a database query to finish, the entire application freezes. So, how can Node.js serve millions of concurrent users without locking up?
    </p>,
    <p key="2">
      The secret is the <strong>Event Loop</strong>. Think of the Event Loop as a super-fast traffic cop standing in the middle of a massive intersection, directing incoming tasks to different lanes based on what they need to do. When V8 encounters something slow (like a timer or network request), it hands the task off to the underlying C++ library (Libuv), and tells the Event Loop: <em>"Remind me when this is done."</em> Then, V8 instantly moves on to execute the next line of code.
    </p>,
    <p key="3">
      The Event Loop itself spins infinitely, progressing through specific <strong>phases</strong> in order:
    </p>,
    <ul key="4" className="list-disc pl-5 text-[15px] text-text-secondary leading-[1.8] space-y-2 mb-8">
      <li><strong>Timers:</strong> Executes callbacks from <code>setTimeout()</code> and <code>setInterval()</code>.</li>
      <li><strong>Pending Callbacks:</strong> Executes I/O callbacks deferred to the next loop iteration.</li>
      <li><strong>Idle, Prepare:</strong> Only used internally by Libuv.</li>
      <li><strong>Poll:</strong> Retrieves new I/O events (like incoming network connections or file system events). Node.js often blocks and waits here if there is nothing else to do.</li>
      <li><strong>Check:</strong> Executes callbacks from <code>setImmediate()</code>.</li>
      <li><strong>Close Callbacks:</strong> Executes close events (e.g., <code>socket.on('close')</code>).</li>
    </ul>
  ],
  basicExample: `console.log("1. I run first!");

setTimeout(() => {
  console.log("3. I run last, handled in the Timers phase.");
}, 1000);

console.log("2. I run second, without waiting!");`,
  advancedTitle: "Real-World: Engine Multitasking",
  advancedParagraphs: [
    <p key="1">
      Let's look at how this applies to our <strong>Real-time P2P File Sync Engine</strong>.
    </p>,
    <p key="2">
      Because the Event Loop constantly cycles through its phases, our engine can send a heartbeat ping every 5 seconds (Timers), watch thousands of files (Poll), and listen for incoming WebRTC messages all at the exact same time—without ever freezing!
    </p>
  ],
  advancedExample: `// In our File Sync Engine, the Event Loop cycles
// through phases to handle multiple tasks concurrently.

// Phase 1: Timers
setTimeout(() => {
  console.log('Sending heartbeat to peer...');
}, 5000);

// Phase 2: Poll (I/O)
fs.watch('./my-project', (eventType, filename) => {
  console.log(\`Detected change in \${filename}\`);
});

console.log('Engine started. The Event Loop is now spinning!');`,
  extraExamples: [
    {
      title: "Edge Case: Blocking the Event Loop",
      paragraphs: [
        <p key="1">
          While the Event Loop is incredibly powerful, it has a fatal weakness: <strong>CPU-intensive tasks</strong>. If you run a massive mathematical calculation (or heavy cryptography) synchronously on the main thread, the Event Loop cannot move to the next phase. The entire application freezes until the calculation is finished.
        </p>
      ],
      code: `const crypto = require('crypto');

console.log("1. Starting password hash...");

// DANGER: pbkdf2Sync blocks the Event Loop!
// If this takes 2 seconds, ALL other users waiting for 
// network requests will simply timeout and fail.
const hash = crypto.pbkdf2Sync('password123', 'salt', 100000, 64, 'sha512');

console.log("2. Hash finished! (Everything else was frozen)");`
    }
  ]
};
