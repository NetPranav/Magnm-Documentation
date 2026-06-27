import React from 'react';

export const topic8Content = {
  description: "Understanding synchronous vs asynchronous file reading and when to block.",
  paragraphs: [
    <p key="1">
      The <code>fs</code> (File System) module provides two primary ways to read a file: <strong>Synchronous</strong> (<code>fs.readFileSync</code>) and <strong>Asynchronous</strong> (<code>fs.readFile</code>). Understanding when to use which is critical for performance.
    </p>,
    <p key="2">
      <strong>Synchronous (readFileSync):</strong> This tells the V8 engine to stop everything and wait. The Event Loop freezes completely until the file is fully loaded into memory. If the file is 1GB, your entire application will hang for several seconds, unable to respond to network requests or timers.
    </p>,
    <p key="3">
      <strong>Asynchronous (readFile):</strong> This hands the task off to Libuv in the background. The Event Loop keeps spinning and serving other requests. When Libuv finishes loading the file, it places a callback in the Event Loop queue with the file data.
    </p>,
    <p key="4">
      <em>Rule of thumb:</em> Only use synchronous methods during the initial startup sequence of your application (e.g., reading a config file once before the server starts). For everything else, use asynchronous methods.
    </p>
  ],
  basicExample: `const fs = require('fs');

// BAD: Blocks the entire application for every request
// If 100 users hit this code, they wait in a single-file line.
function handleUserRequest() {
  const data = fs.readFileSync('data.json'); 
  return JSON.parse(data);
}

// GOOD: Event Loop remains free to serve other users
function handleUserRequestAsync(callback) {
  fs.readFile('data.json', (err, data) => {
    if (err) throw err;
    callback(JSON.parse(data));
  });
}`,
  advancedTitle: "Real-World: Syncing Files Without Freezing",
  advancedParagraphs: [
    <p key="1">
      Let's apply this to our <strong>Real-time P2P File Sync Engine</strong>.
    </p>,
    <p key="2">
      When our VS Code extension boots up, it needs to read the local <code>.sync-config.json</code> file to know which peer to connect to. Because the engine cannot start without this information, it is perfectly acceptable to use <code>fs.readFileSync</code> during the boot sequence.
    </p>,
    <p key="3">
      However, once the engine is running and actively syncing user files over WebRTC, using a synchronous read would freeze VS Code! If a user saves a massive file, the UI would lock up while we read it. For active syncing, we MUST use asynchronous reads.
    </p>
  ],
  advancedExample: `const fs = require('fs');

// 1. BOOT SEQUENCE: Synchronous is OK here.
// The engine can't do anything without this config anyway.
const configData = fs.readFileSync('./.sync-config.json');
const config = JSON.parse(configData);
console.log(\`Connecting to peer: \${config.peerId}\`);

// 2. ACTIVE ENGINE: Synchronous is FATAL here.
// If we used readFileSync, the entire VS Code editor could freeze!
function onUserSavedFile(filePath) {
  // We use the async version so the Event Loop keeps spinning
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return console.error('Failed to read file', err);
    }
    
    // File is ready, send it over WebRTC
    webRtcChannel.send(fileData);
    console.log('File synced successfully in the background!');
  });
}`
};
