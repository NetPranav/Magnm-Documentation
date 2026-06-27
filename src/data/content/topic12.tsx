import React from 'react';

export const topic12Content = {
  description: "Recursively mapping a file system tree using fs.readdir.",
  paragraphs: [
    <p key="1">
      When you use <code>fs.readdir()</code> or <code>fs.promises.readdir()</code>, it only gives you the files and folders located at the exact level you queried. It does not automatically look inside the sub-folders. 
    </p>,
    <p key="2">
      If you need to get a list of every single file in a massive project (like searching for all <code>.js</code> files in a workspace), you need to write a <strong>Recursive Directory Walker</strong>.
    </p>,
    <p key="3">
      A recursive function is a function that calls itself. To walk a directory, the function reads the current folder, loops through the results, and if it encounters another folder, it calls itself again with the new folder path.
    </p>
  ],
  basicExample: `const fs = require('fs/promises');
const path = require('path');

async function walkDir(dirPath) {
  let results = [];
  
  // Use withFileTypes to easily know if an item is a file or folder
  const items = await fs.readdir(dirPath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    
    if (item.isDirectory()) {
      // It's a folder! Call THIS function again recursively!
      const nestedFiles = await walkDir(fullPath);
      results = results.concat(nestedFiles);
    } else {
      // It's a file, add it to our array
      results.push(fullPath);
    }
  }

  return results;
}

walkDir('./my-project').then(console.log);`,
  advancedTitle: "Real-World: Initial Workspace Hash",
  advancedParagraphs: [
    <p key="1">
      Let's apply this to our <strong>Real-time P2P File Sync Engine</strong>.
    </p>,
    <p key="2">
      The very first time our extension connects to a peer, it has no idea what files exist in the user's workspace. Before it can even begin "watching" for changes, it must perform a full <strong>Initial Synchronization</strong>. 
    </p>,
    <p key="3">
      We use a highly-optimized, asynchronous recursive walker to scan the entire workspace. However, we also add a critical feature: <strong>Ignore Lists</strong>. We do not want to recursively walk into <code>node_modules</code> or <code>.git</code> folders, otherwise our Engine would crash trying to process hundreds of thousands of useless files.
    </p>
  ],
  advancedExample: `const fs = require('fs/promises');
const path = require('path');

// Inside our File Sync Engine...

const IGNORE_DIRS = ['node_modules', '.git', '.sync-engine'];

async function scanWorkspaceForSync(dirPath) {
  let syncList = [];
  
  const items = await fs.readdir(dirPath, { withFileTypes: true });

  // Use Promise.all to scan all subdirectories in parallel!
  const scanPromises = items.map(async (item) => {
    const fullPath = path.join(dirPath, item.name);
    
    if (item.isDirectory()) {
      // SKIP massive ignored folders to save CPU & Memory
      if (IGNORE_DIRS.includes(item.name)) return;
      
      const nestedFiles = await scanWorkspaceForSync(fullPath);
      syncList.push(...nestedFiles);
    } else {
      // Calculate hash and queue for sync check
      syncList.push({
        path: fullPath,
        lastModified: fs.statSync(fullPath).mtimeMs // OK for boot sequence
      });
    }
  });

  await Promise.all(scanPromises);
  return syncList;
}`,
  quiz: {
    title: "Module II: The File System Quiz",
    questions: [
      {
        question: "What is the key difference between fs.readFileSync() and fs.readFile()?",
        options: [
          "readFileSync is faster",
          "readFile is synchronous, readFileSync is asynchronous",
          "readFileSync blocks the Event Loop, readFile is non-blocking",
          "They are identical"
        ],
        correctAnswerIndex: 2,
        explanation: "readFileSync blocks the entire Event Loop until the file is fully read. readFile uses a callback and allows Node.js to continue processing other requests while waiting for the disk."
      },
      {
        question: "What does the fs/promises API return?",
        options: ["Callbacks", "Streams", "Promises that can be used with async/await", "Synchronous values"],
        correctAnswerIndex: 2,
        explanation: "The fs/promises API wraps all file system operations in Promises, allowing you to use clean async/await syntax instead of deeply nested callbacks."
      },
      {
        question: "Why is watching files with fs.watch() important for a File Sync Engine?",
        options: [
          "It makes files load faster",
          "It lets you detect file changes in real-time without polling",
          "It compresses files automatically",
          "It encrypts file contents"
        ],
        correctAnswerIndex: 1,
        explanation: "fs.watch() uses OS-level file system notifications to instantly detect when files are created, modified, or deleted — without wasting CPU on constant polling."
      },
      {
        question: "What is the best way to read a 10GB log file in Node.js?",
        options: [
          "fs.readFileSync() to load it all into RAM",
          "fs.readFile() with a callback",
          "Use a Readable Stream (fs.createReadStream) to process it in chunks",
          "Split it into 10 smaller files first"
        ],
        correctAnswerIndex: 2,
        explanation: "Readable Streams process data in small chunks, allowing you to handle files far larger than your available RAM without crashing."
      }
    ]
  }
};
