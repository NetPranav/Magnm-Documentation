import React from 'react';
import Link from 'next/link';

export const topic1Content = {
  description: "A ridiculously simple breakdown of the two engines that power Node.js: V8 and Libuv.",
  paragraphs: [
    <p key="1">
      If you open a browser, JavaScript runs inside it. But what if you want to run JavaScript directly on your computer, without a browser? That's what Node.js is. 
    </p>,
    <p key="2">
      Node.js is not a programming language. It is simply a wrapper around two massive engines that do all the heavy lifting:
    </p>,
    <ul key="3" className="list-disc pl-5 text-[15px] text-text-secondary leading-[1.8] space-y-2 mb-8">
      <li><strong>The V8 Engine:</strong> Created by Google. It reads your JavaScript code and translates it into machine code that your computer's processor can instantly execute.</li>
      <li><strong>Libuv:</strong> A library written in C. It handles all the "slow" stuff like reading files, waiting for network requests, or setting timers. It does this in the background so V8 doesn't have to wait.</li>
    </ul>
  ],
  basicExample: `// A simple script
const message = "Hello, V8!";
console.log(message);`,
  advancedTitle: "The Real-World Example",
  advancedParagraphs: [
    <p key="1">
      Let's look at how this applies to our running example: <strong>The Real-time P2P File Sync Engine</strong>.
    </p>,
    <p key="2">
      If we want to sync files across computers, we need to know the exact moment a file is saved. If V8 had to sit and stare at a file waiting for it to change, your entire app would freeze. Instead, we use a Node.js module (like <code>fs</code>) to hand the job off to <strong>Libuv</strong>. Libuv quietly asks your Operating System to watch the folder in the background.
    </p>
  ],
  advancedExample: `const fs = require('fs');

// Our File Sync Engine watches a folder
// fs.watch uses Libuv to ask the OS to notify us of changes,
// so the V8 engine isn't blocked waiting for files to save.
fs.watch('./my-project', (eventType, filename) => {
  console.log(\`File \${filename} changed! Event: \${eventType}\`);
  // Next step: read the file and sync via WebRTC...
});

console.log('Watching for changes... (main thread is free!)');`
};
