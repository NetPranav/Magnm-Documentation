import React from 'react';

export const topic7Content = {
  description: "Cross-platform path resolution and safe directory traversal.",
  paragraphs: [
    <p key="1">
      When building a Node.js application, you will constantly need to interact with the file system. However, different Operating Systems handle file paths differently. For example, Windows uses backslashes (<code>C:\\Users\\Bob\\Desktop</code>), while macOS and Linux use forward slashes (<code>/Users/Bob/Desktop</code>).
    </p>,
    <p key="2">
      If you hardcode slashes in your code, your application will crash when run on a different OS. To solve this, Node.js provides the <code>path</code> module. It acts as a universal translator, ensuring your file paths are perfectly formatted for whatever operating system the user is currently on.
    </p>,
    <ul key="3" className="list-disc pl-5 text-[15px] text-text-secondary leading-[1.8] space-y-2 mb-8">
      <li><strong>path.join():</strong> Safely joins multiple string segments into a single, valid path.</li>
      <li><strong>path.resolve():</strong> Resolves a sequence of paths into an absolute, root-level path.</li>
      <li><strong>__dirname:</strong> A global variable that always holds the absolute path to the directory of the file currently executing.</li>
    </ul>
  ],
  basicExample: `const path = require('path');

// 1. Join segments safely
// Output on Mac/Linux: 'users/bob/desktop'
// Output on Windows:   'users\\bob\\desktop'
const desktopPath = path.join('users', 'bob', 'desktop');

// 2. Getting the absolute path to a config file
const configPath = path.join(__dirname, 'config.json');
console.log(configPath);`,
  advancedTitle: "Real-World: Extension Workspaces",
  advancedParagraphs: [
    <p key="1">
      Let's apply this to our <strong>Real-time P2P File Sync Engine</strong> (which runs inside a VS Code Extension).
    </p>,
    <p key="2">
      When a user opens a workspace in VS Code, we need to locate a specific hidden folder (<code>.sync-engine</code>) to store our cryptographic hashes. Because developers can open workspaces on Windows, Mac, or Linux, we cannot guess the path format. We must use <code>path.join()</code> to guarantee our engine doesn't crash when trying to read or write the hash files.
    </p>
  ],
  advancedExample: `const path = require('path');
const fs = require('fs');

// In VS Code, we receive the current workspace root dynamically
function initializeSyncEngine(workspaceRootPath) {
  
  // Safely construct the path to our hidden storage folder
  // Works flawlessly on Windows, Mac, and Linux!
  const storageDir = path.join(workspaceRootPath, '.sync-engine');
  
  // Construct the path to the specific hash file
  const hashFilePath = path.join(storageDir, 'hashes.json');

  if (!fs.existsSync(storageDir)) {
    console.log(\`Creating storage directory at: \${storageDir}\`);
    fs.mkdirSync(storageDir);
  }

  return hashFilePath;
}`
};
