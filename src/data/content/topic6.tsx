import React from 'react';

export const topic6Content = {
  description: "Mastering Callback Hell, Promises, and deep Async/Await execution order.",
  paragraphs: [
    <p key="1">
      Because Node.js operates on a single thread (using the Event Loop), almost all operations that involve I/O (like reading a file or making a network request) are <strong>asynchronous</strong>. 
    </p>,
    <p key="2">
      If they were synchronous, the entire application would freeze and wait for the file to finish reading before executing the next line of code. To handle this, Node.js originally used <strong>Callbacks</strong>—functions passed as arguments to be executed when the operation finished.
    </p>,
    <p key="3">
      However, callbacks quickly led to the infamous "Callback Hell" (a pyramid of doom). Modern Node.js relies almost entirely on <strong>Promises</strong> and the syntactic sugar of <strong>Async/Await</strong> to make asynchronous code look and behave like synchronous code.
    </p>
  ],
  basicExample: `// 1. The Old Way: Callback Hell
fs.readFile('config.json', (err, data) => {
  if (err) throw err;
  db.connect(data.dbUrl, (err, connection) => {
    if (err) throw err;
    connection.query('SELECT * FROM users', (err, users) => {
      // Pyramid of Doom...
    });
  });
});

// 2. The Modern Way: Async / Await
async function fetchUsers() {
  try {
    // Execution pauses here, yielding control back to the Event Loop
    const data = await fs.promises.readFile('config.json');
    const connection = await db.connect(data.dbUrl);
    const users = await connection.query('SELECT * FROM users');
    return users;
  } catch (err) {
    console.error('Something failed!', err);
  }
}`,
  advancedTitle: "Real-World: Parallel Execution & Promise.all",
  advancedParagraphs: [
    <p key="1">
      Let's apply this to our <strong>Real-time P2P File Sync Engine</strong>.
    </p>,
    <p key="2">
      When our engine starts up, it needs to scan the entire workspace directory and calculate the cryptographic hash of every single file so it can determine what needs to be synced with the peer. 
    </p>,
    <p key="3">
      If a workspace has 1,000 files, hashing them one by one using <code>await</code> in a standard <code>for</code> loop would take forever. The Event Loop would sit completely idle waiting for file 1 to finish before even starting file 2. To maximize performance, we fire off all 1,000 read operations simultaneously and use <code>Promise.all()</code> to wait for them to finish as a collective group.
    </p>
  ],
  advancedExample: `// Inside our File Sync Engine...

async function hashWorkspaceFiles(filePaths) {
  console.log(\`Hashing \${filePaths.length} files...\`);

  // BAD: Sequential execution (Very Slow)
  // for (const path of filePaths) {
  //   await hashFile(path); // Event loop waits here completely
  // }

  // GOOD: Parallel execution (Extremely Fast)
  // We map the array of strings into an array of pending Promises
  const hashingPromises = filePaths.map(path => {
    // We don't 'await' here! We just return the Promise.
    // This tells Node.js to fire off 1000 tasks to Libuv instantly.
    return hashFile(path); 
  });

  // Now, we wait for all 1,000 tasks to finish simultaneously.
  // The Event Loop is free to handle other things while Libuv works.
  try {
    const allHashes = await Promise.all(hashingPromises);
    console.log('All files hashed successfully!');
    return allHashes;
  } catch (err) {
    // If even ONE file fails to hash, the entire Promise.all rejects.
    console.error('Sync failed: Could not read a file.', err);
    throw err; 
  }
}`
};
