import React from 'react';

export const topic4Content = {
  description: "How V8 allocates memory and when it decides to clean it up (Garbage Collection).",
  paragraphs: [
    <p key="1">
      Unlike low-level languages like C or C++, JavaScript developers don't have to manually allocate and free memory. Node.js uses the <strong>V8 Engine</strong>, which handles this automatically through a process called <strong>Garbage Collection (GC)</strong>.
    </p>,
    <p key="2">
      Memory in V8 is divided into two main areas: the <strong>Stack</strong> and the <strong>Heap</strong>. 
    </p>,
    <ul key="3" className="list-disc pl-5 text-[15px] text-text-secondary leading-[1.8] space-y-2 mb-8">
      <li><strong>The Stack:</strong> Stores primitive values (numbers, booleans) and function frames. It's incredibly fast and self-cleaning. When a function finishes executing, its stack frame is instantly popped off and destroyed.</li>
      <li><strong>The Heap:</strong> Stores objects, arrays, closures, and large buffers. It's much larger and slower. Because objects can live longer than the function that created them, the Heap must be managed by the Garbage Collector.</li>
    </ul>,
    <p key="4">
      The Garbage Collector periodically pauses your Node.js application (a "stop-the-world" event) to scan the Heap. It looks for objects that are no longer reachable from the root of your application. If an object is completely isolated, it is swept away, and the memory is reclaimed.
    </p>
  ],
  basicExample: `// 1. Primitive goes to the Stack (fast, auto-cleaned)
let counter = 42; 

// 2. Object goes to the Heap (needs Garbage Collection)
let config = { active: true }; 

// 3. We remove our reference to the object
config = null; 

// During the next GC cycle, V8 sees the { active: true } object 
// has zero references pointing to it, so it deletes it from memory!`,
  advancedTitle: "Real-World: Preventing Memory Leaks",
  advancedParagraphs: [
    <p key="1">
      Let's apply this to our <strong>Real-time P2P File Sync Engine</strong>.
    </p>,
    <p key="2">
      Since our sync engine runs continuously as a background process in VS Code, a <strong>Memory Leak</strong> is fatal. A memory leak happens when you accidentally keep references to objects you no longer need. The Garbage Collector sees the reference and says, <em>"I guess they still need this,"</em> and never deletes it. Over hours, the Heap fills up until Node.js crashes with a fatal <code>FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory</code>.
    </p>,
    <p key="3">
      A massive culprit for memory leaks in Node.js are <strong>Event Listeners</strong> and <strong>Global Arrays</strong>.
    </p>
  ],
  advancedExample: `// Inside our File Sync Engine...

const activeSyncSessions = [];

function startSync(fileId) {
  const sessionData = new Buffer.alloc(1024 * 1024 * 10); // 10MB chunk
  
  // DANGER: We are pushing massive objects into a global array.
  activeSyncSessions.push({ id: fileId, data: sessionData });

  syncViaWebRTC(sessionData).then(() => {
    console.log('Sync complete!');
    // FATAL FLAW: We forgot to remove the session from the array!
    // Even though the sync is done, the global array still holds a 
    // reference to the 10MB chunk. 
    // The Garbage Collector will NEVER clean it up!
  });
}

// FIX: Always explicitly clean up references when done!
function fixedStartSync(fileId) {
  // ...
  syncViaWebRTC(sessionData).then(() => {
    // Find and remove the reference so V8 can garbage collect it
    const index = activeSyncSessions.findIndex(s => s.id === fileId);
    activeSyncSessions.splice(index, 1);
  });
}`
};
