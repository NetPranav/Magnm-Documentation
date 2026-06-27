import React from 'react';

export const topic9Content = {
  description: "Modern asynchronous file operations using Promises instead of callbacks.",
  paragraphs: [
    <p key="1">
      As we learned in previous topics, asynchronous file operations (like <code>fs.readFile</code>) rely heavily on callbacks. While callbacks work perfectly fine, they can quickly lead to deeply nested "callback hell" if you need to read a file, modify it, and write it back.
    </p>,
    <p key="2">
      To solve this, Node.js introduced the <code>fs/promises</code> API. It provides the exact same asynchronous, non-blocking file system methods, but they return <strong>Promises</strong> instead of requiring callbacks. This allows you to use clean, modern <code>async/await</code> syntax when dealing with the file system.
    </p>
  ],
  basicExample: `const fs = require('fs/promises');

// Using async/await makes asynchronous file operations 
// look incredibly clean and readable.
async function updateConfig() {
  try {
    // 1. Read the file (Execution pauses, Event Loop continues)
    const rawData = await fs.readFile('config.json', 'utf8');
    const config = JSON.parse(rawData);

    // 2. Modify data
    config.lastUpdated = Date.now();

    // 3. Write it back (Execution pauses, Event Loop continues)
    await fs.writeFile('config.json', JSON.stringify(config));
    
    console.log('Config updated successfully!');
  } catch (error) {
    console.error('Failed to update config:', error);
  }
}

updateConfig();`,
  advancedTitle: "Real-World: Checking File Existence",
  advancedParagraphs: [
    <p key="1">
      Let's apply this to our <strong>Real-time P2P File Sync Engine</strong>.
    </p>,
    <p key="2">
      A massive gotcha in Node.js is that <code>fs.exists()</code> is deprecated, and <code>fs.existsSync()</code> blocks the Event Loop. So how do we check if a file exists asynchronously? The official Node.js recommendation is to use <code>fs.promises.access()</code> or <code>fs.promises.stat()</code>, which checks for permissions or metadata, and throws an error if the file doesn't exist.
    </p>
  ],
  advancedExample: `const fs = require('fs/promises');

// Inside our File Sync Engine...
async function syncFileIfItExists(filePath) {
  try {
    // We attempt to access the file metadata.
    // If it fails, the file doesn't exist (or we lack permissions).
    await fs.access(filePath);
    
    console.log(\`File \${filePath} exists! Reading data...\`);
    const data = await fs.readFile(filePath);
    
    // Broadcast to peer
    webRtcChannel.send(data);
    
  } catch (error) {
    // The access check failed
    if (error.code === 'ENOENT') {
      console.log(\`Ignored: \${filePath} does not exist.\`);
    } else {
      console.error(\`Failed to access \${filePath}\`, error);
    }
  }
}`
};
