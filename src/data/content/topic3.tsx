import React from 'react';

export const topic3Content = {
  description: "Understanding the microtask queue and timer phases.",
  paragraphs: [
    <p key="1">
      In the last topic, we learned that the Event Loop spins in phases. But sometimes, you need absolute control over exactly <em>when</em> a piece of code runs. This is where <code>process.nextTick()</code> and <code>setImmediate()</code> come in, and despite their names, they do the exact opposite of what you might think.
    </p>,
    <ul key="2" className="list-disc pl-5 text-[15px] text-text-secondary leading-[1.8] space-y-2 mb-8">
      <li><strong>process.nextTick():</strong> This says, <em>"Stop everything and run this the exact millisecond the current operation finishes!"</em> It doesn't wait for the next phase; it cuts in line.</li>
      <li><strong>setImmediate():</strong> This says, <em>"Run this eventually, but only after you finish all current I/O tasks."</em> It politely waits for the 'Check' phase of the Event Loop.</li>
    </ul>
  ],
  basicExample: `console.log("1. Start");

setImmediate(() => {
  console.log("4. setImmediate runs in the Check phase.");
});

process.nextTick(() => {
  console.log("3. nextTick runs immediately after current operation!");
});

console.log("2. End");`,
  advancedTitle: "The Real-World Example",
  advancedParagraphs: [
    <p key="1">
      Let's apply this to our <strong>Real-time P2P File Sync Engine</strong>.
    </p>,
    <p key="2">
      Imagine we are preparing to broadcast a file over WebRTC, but we realize the file doesn't exist. We want to log that critical error <em>immediately</em> before doing anything else. However, if the file is fine, we want to send it over WebRTC using <code>setImmediate()</code> so we don't accidentally freeze the engine from reading other incoming files.
    </p>
  ],
  advancedExample: `// Inside our File Sync Engine...

function broadcastSync(file) {
  // If we notice a critical error, we want to handle it BEFORE
  // moving on to the next phase of the Event Loop.
  if (!file) {
    process.nextTick(() => {
      console.error('CRITICAL: Sync failed, file missing!');
    });
    return;
  }

  // Normal broadcasting is placed at the end of the loop 
  // so we don't delay other I/O operations.
  setImmediate(() => {
    sendWebRTCMessage({ type: 'SYNC', data: file });
  });
}

broadcastSync(null);`
};
