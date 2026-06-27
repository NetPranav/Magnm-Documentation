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
}`
};
