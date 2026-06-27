import React from 'react';

export const topic19Content = {
  description: "Executing shell commands directly from your Node.js application.",
  paragraphs: [
    <p key="1">
      Up until now, our Node.js applications have been living in isolation. But sometimes, you need to step outside of JavaScript and interact with the underlying Operating System. 
    </p>,
    <p key="2">
      The <code>child_process</code> module allows Node.js to spin up new, independent processes. The simplest way to do this is using <code>exec()</code>. It spawns a shell (like bash or zsh), runs a command of your choice, and buffers the output in memory before returning it to your callback.
    </p>,
    <p key="3">
      While extremely easy to use, <code>exec()</code> should <strong>only</strong> be used for commands that return a small amount of data. Because it buffers the entire output in memory, running a command that outputs massive amounts of text (like <code>ls -lR /</code>) will crash your Node process.
    </p>
  ],
  basicExample: `const { exec } = require('child_process');

// 1. Run a simple shell command (e.g. checking Node version)
exec('node -v', (error, stdout, stderr) => {
  if (error) {
    console.error(\`Execution Error: \${error.message}\`);
    return;
  }
  
  if (stderr) {
    console.error(\`Shell Error: \${stderr}\`);
    return;
  }
  
  // 2. The output is buffered and given to us as a string
  console.log(\`Success! You are running Node version: \${stdout}\`);
});`,
  advancedTitle: "Real-World: Automated System Backups",
  advancedParagraphs: [
    <p key="1">
      Let's step away from the File Sync engine and look at a <strong>DevOps Tooling</strong> example.
    </p>,
    <p key="2">
      Imagine you want to build a Node.js script that automatically backs up your MongoDB database every night at midnight. You don't need to write complex database drivers; you can simply use <code>child_process.exec()</code> to run the official <code>mongodump</code> CLI tool installed on your server!
    </p>
  ],
  advancedExample: `const { exec } = require('child_process');

function runDailyBackup() {
  console.log("Starting database backup...");
  
  // We use exec() to run the mongodump CLI tool from our shell
  const command = 'mongodump --uri="mongodb://localhost:27017/myApp" --out=/backups/today';

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("CRITICAL FAILURE: Backup failed to run!");
      console.error(error);
      return;
    }
    
    // mongodump often logs to stderr even on success
    console.log("Backup complete! Logs:");
    console.log(stderr || stdout);
  });
}

// In a real app, you'd trigger this using a cron job library
runDailyBackup();`
};
