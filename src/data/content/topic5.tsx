import React from 'react';

export const topic5Content = {
  description: "Interacting with the operating system environment, arguments, and exit codes.",
  paragraphs: [
    <p key="1">
      The <code>process</code> object is a global variable in Node.js that provides incredible power over the current running environment. Because it is global, it is available in every single file of your application without needing to <code>require</code> or <code>import</code> it.
    </p>,
    <p key="2">
      Think of the <code>process</code> object as the bridge between your JavaScript code and the underlying Operating System (macOS, Windows, or Linux). 
    </p>,
    <ul key="3" className="list-disc pl-5 text-[15px] text-text-secondary leading-[1.8] space-y-2 mb-8">
      <li><strong>Environment Variables (<code>process.env</code>):</strong> Read secrets, API keys, or configuration flags passed into the application from the OS.</li>
      <li><strong>Command Line Arguments (<code>process.argv</code>):</strong> Read the exact arguments the user typed into the terminal when starting your app.</li>
      <li><strong>Process Lifecycle (<code>process.exit()</code>):</strong> Force the application to shut down immediately, returning a specific success or failure code to the OS.</li>
    </ul>
  ],
  basicExample: `// 1. Read an environment variable
const port = process.env.PORT || 3000;
console.log(\`Starting server on port \${port}\`);

// 2. Read command line arguments
// If user runs: node script.js --force
const isForceMode = process.argv.includes('--force');

// 3. Exit with a failure code (1) instead of success (0)
if (!process.env.API_KEY) {
  console.error("Missing API_KEY!");
  process.exit(1); 
}`,
  advancedTitle: "Real-World: Graceful Shutdowns",
  advancedParagraphs: [
    <p key="1">
      Let's apply this to our <strong>Real-time P2P File Sync Engine</strong>.
    </p>,
    <p key="2">
      Imagine our File Sync Engine is currently uploading a massive 5GB video file to a peer over WebRTC. Suddenly, the user presses <code>Ctrl+C</code> in their terminal to kill the engine. 
    </p>,
    <p key="3">
      By default, Node.js will instantly terminate. The 5GB file transfer will be severed, resulting in corrupted data for the peer. To prevent this, we can use the <code>process</code> object to listen for OS termination signals (like <code>SIGINT</code> or <code>SIGTERM</code>) and orchestrate a <strong>Graceful Shutdown</strong>.
    </p>
  ],
  advancedExample: `// Inside our File Sync Engine...

let isShuttingDown = false;

// Listen for Ctrl+C (SIGINT - Signal Interrupt) from the OS
process.on('SIGINT', async () => {
  if (isShuttingDown) return; // Prevent double-triggering
  isShuttingDown = true;
  
  console.log('\\nCaught interrupt signal! Initiating graceful shutdown...');

  try {
    // 1. Stop accepting new file sync requests
    await p2pServer.stopListening();
    
    // 2. Wait for current active transfers to finish
    await waitForActiveTransfers(); 
    
    // 3. Safely disconnect WebRTC sockets
    closeAllSockets();
    
    console.log('Engine shut down safely. No data corrupted.');
    process.exit(0); // Exit cleanly
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1); // Exit with error code
  }
});`
};
