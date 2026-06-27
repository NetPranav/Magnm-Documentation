import React from 'react';
import Link from 'next/link';

export const topic2Content = {
  description: "A simple breakdown of how Node.js juggles tasks.",
  paragraphs: [
    <p key="1">
      Node.js is famous for being <strong>single-threaded</strong>. This means it only has one brain to process JavaScript. If it stops to wait for a file to save, the entire app freezes. So, how can it serve thousands of users at once?
    </p>,
    <p key="2">
      The secret is the <strong>Event Loop</strong>. Think of the Event Loop as a super-fast traffic cop standing in the middle of an intersection, directing tasks to different lanes.
    </p>
  ],
  basicExample: `console.log("1. I run first!");

setTimeout(() => {
  console.log("3. I run last, after 1 second.");
}, 1000);

console.log("2. I run second, without waiting!");`,
  advancedTitle: "The Real-World Example",
  advancedParagraphs: [
    <p key="1">
      Let's look at how this applies to our <strong>Real-time P2P File Sync Engine</strong>.
    </p>,
    <p key="2">
      The Event Loop doesn't just do tasks randomly; it executes them in specific <strong>phases</strong>. First it checks expiring <Link href="#timers">Timers</Link> (like <code>setTimeout</code>), then it checks for <Link href="#io">I/O callbacks</Link> (like a file being saved or a network packet arriving). 
    </p>
  ],
  advancedExample: `// In our File Sync Engine, the Event Loop constantly cycles
// through different phases to handle multiple tasks at once.

// Phase 1: Timers
// The Event Loop checks if our WebRTC heartbeat timer is ready.
setTimeout(() => {
  console.log('Sending heartbeat to peer...');
}, 5000);

// Phase 2: Poll (I/O)
// The Event Loop checks if Libuv has noticed any file changes.
fs.watch('./my-project', (eventType, filename) => {
  console.log(\`Detected change in \${filename}\`);
});

console.log('Engine started. The Event Loop is now spinning!');`
};
