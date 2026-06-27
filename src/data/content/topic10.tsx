import React from 'react';

export const topic10Content = {
  description: "Listening for OS events to trigger code when files change.",
  paragraphs: [
    <p key="1">
      Sometimes reading a file once isn't enough. You might need your application to react dynamically whenever a file is modified, created, or deleted by a user or another process.
    </p>,
    <p key="2">
      Instead of using a <code>setInterval</code> to constantly read the file every few seconds (which is incredibly CPU intensive and a terrible practice known as "polling"), Node.js provides <code>fs.watch()</code>. 
    </p>,
    <p key="3">
      <code>fs.watch()</code> hooks directly into the Operating System's native file-system event APIs (like <code>inotify</code> on Linux, <code>FSEvents</code> on macOS). The OS sits quietly and only wakes up your Node.js application at the exact millisecond a file event occurs. This uses virtually 0% CPU while idle!
    </p>
  ],
  basicExample: `const fs = require('fs');

// We tell the OS to watch the 'logs.txt' file.
// The callback fires ONLY when a change occurs.
fs.watch('logs.txt', (eventType, filename) => {
  if (eventType === 'change') {
    console.log(\`\${filename} was modified!\`);
  } else if (eventType === 'rename') {
    console.log(\`\${filename} was created or deleted!\`);
  }
});

console.log('Listening for changes natively (0% CPU cost)...');`,
  advancedTitle: "Real-World: Debouncing File Events",
  advancedParagraphs: [
    <p key="1">
      Let's apply this to our <strong>Real-time P2P File Sync Engine</strong>.
    </p>,
    <p key="2">
      Our engine needs to watch the entire user workspace and broadcast changes to the peer. However, native OS file events are notoriously noisy. If a user presses <code>Cmd+S</code> (Save) in their editor, the OS might rapidly fire 3 or 4 "change" events within a few milliseconds (as the editor truncates, writes, and finalizes the file).
    </p>,
    <p key="3">
      If we try to broadcast the file over WebRTC every time the event fires, we will cause a massive network flood. To fix this, we must implement a <strong>Debounce</strong> mechanism to ensure we only sync the file once it has settled.
    </p>
  ],
  advancedExample: `const fs = require('fs');

// Inside our File Sync Engine...

// A dictionary to track pending sync timers for different files
const pendingSyncs = {};

fs.watch('./workspace', (eventType, filename) => {
  if (!filename) return;

  // 1. If a timer is already running for this file, clear it!
  // This effectively ignores the rapid-fire "noisy" events.
  if (pendingSyncs[filename]) {
    clearTimeout(pendingSyncs[filename]);
  }

  // 2. Set a new timer. We only actually sync the file if 
  // 500ms passes WITHOUT another file event firing.
  pendingSyncs[filename] = setTimeout(() => {
    
    console.log(\`\${filename} settled. Starting WebRTC sync...\`);
    syncFileToPeer(filename);
    
    // Cleanup the dictionary to prevent memory leaks!
    delete pendingSyncs[filename];
    
  }, 500); // 500ms Debounce Window
});`
};
