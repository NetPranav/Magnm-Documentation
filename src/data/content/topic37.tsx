import React from 'react';

export const topic37Content = {
  description: "The core design pattern driving Node.js.",
  difficulty: "Beginner" as const,
  paragraphs: [
    <p key="1">
      You've seen callbacks like <code>socket.on('data', ...)</code> and <code>server.on('request', ...)</code> everywhere in Node.js. This is because almost every core module in Node.js inherits from the <strong><code>EventEmitter</code></strong> class!
    </p>,
    <p key="2">
      The Event Emitter pattern allows you to decouple your architecture. Instead of function A calling function B directly, function A simply "emits" an event into the void. Function B (and C, and D) "listen" for that event and react to it independently.
    </p>,
    <p key="3">
      This is the observer pattern, and it is the absolute foundation of how asynchronous Node.js handles millions of concurrent data streams without blocking.
    </p>
  ],
  basicExample: `const EventEmitter = require('events');

// 1. Create a custom Emitter
const myEmitter = new EventEmitter();

// 2. Set up a Listener (Observer)
myEmitter.on('userSignup', (username) => {
  console.log(\`Sending welcome email to \${username}\`);
});

// 3. Set up another Listener for the exact same event!
myEmitter.on('userSignup', (username) => {
  console.log(\`Adding \${username} to the database\`);
});

// 4. Trigger the event somewhere else in your app
console.log("A user just submitted the signup form!");
myEmitter.emit('userSignup', 'alice_coder');`,
  advancedTitle: "Real-World: Extending EventEmitter",
  advancedParagraphs: [
    <p key="1">
      In professional codebases, you rarely instantiate a raw <code>EventEmitter</code>. Instead, you create your own custom classes and have them <em>extend</em> the <code>EventEmitter</code> class.
    </p>,
    <p key="2">
      This turns your custom objects into reactive data sources. For example, our <code>FileSyncEngine</code> class would inherit from <code>EventEmitter</code>, allowing the UI layer to easily listen to <code>engine.on('progress')</code> without the Engine needing to know anything about the UI!
    </p>
  ],
  advancedExample: `const EventEmitter = require('events');

class FileSyncEngine extends EventEmitter {
  constructor() {
    super(); // Must call super() to initialize the EventEmitter
    this.progress = 0;
  }

  startSync() {
    this.emit('start', 'Syncing started');
    
    // Simulate work
    const interval = setInterval(() => {
      this.progress += 25;
      this.emit('progress', this.progress); // Emit data over time
      
      if (this.progress === 100) {
        clearInterval(interval);
        this.emit('complete', 'Sync finished!');
      }
    }, 500);
  }
}

const engine = new FileSyncEngine();
engine.on('progress', (percent) => console.log(\`Sync is at \${percent}%\`));
engine.startSync();`
};
