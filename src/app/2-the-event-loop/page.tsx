import React from 'react';
import SyntaxHoverCode from '@/components/SyntaxHoverCode';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '2. The Event Loop | Magnum Documentation',
  description: 'A simple breakdown of how Node.js juggles tasks.',
};

export default function EventLoop() {
  const basicExample = `console.log("1. I run first!");

setTimeout(() => {
  console.log("3. I run last, after 1 second.");
}, 1000);

console.log("2. I run second, without waiting!");`;

  const advancedExample = `// In our File Sync Engine, the Event Loop constantly cycles
// through different phases to handle multiple tasks at once.

// Phase 1: Timers
// The Event Loop checks if our WebRTC heartbeat timer is ready.
setTimeout(() => {
  console.log('Sending heartbeat to peer...');
}, 5000);

// Phase 2: Poll (I/O)
// The Event Loop checks if Libuv has noticed any file changes.
fs.watch('./my-project', (eventType, filename) => {
  console.log(\`Detected change in \${filename}\`);
});

console.log('Engine started. The Event Loop is now spinning!');`;

  return (
    <div className="flex flex-col pb-24 overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section id="overview" className="relative pt-2 pb-8 border-b border-border">
        <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-medium mb-6">
          Topic 2
        </p>
        <h1 className="font-serif text-[28px] sm:text-4xl md:text-[44px] lg:text-[52px] font-medium text-foreground mb-6 leading-[1.15] tracking-tight">
          The Event <em className="not-italic text-primary-dark">Loop</em>
        </h1>
        <p className="text-[15px] text-text-secondary max-w-xl leading-[1.8] mb-4">
          How Node.js manages to handle thousands of tasks simultaneously while only using a single thread.
        </p>
      </section>

      {/* Content Section */}
      <section id="content" className="py-8 prose prose-slate max-w-none prose-p:text-[15px] prose-p:text-text-secondary prose-p:leading-[1.8] prose-headings:font-serif prose-headings:font-medium prose-headings:text-foreground prose-a:text-primary-dark prose-a:no-underline hover:prose-a:underline">
        <p>
          Node.js is famous for being <strong>single-threaded</strong>. This means it only has one brain to process JavaScript. If it stops to wait for a file to save, the entire app freezes. So, how can it serve thousands of users at once?
        </p>
        <p>
          The secret is the <strong>Event Loop</strong>. Think of the Event Loop as a super-fast traffic cop standing in the middle of an intersection, directing tasks to different lanes.
        </p>

        <h3 id="basic-example" className="text-2xl mt-10 mb-4">The Basic Example</h3>
        <p>
          When V8 encounters something slow (like a timer or network request), it hands it off to Libuv, and tells the Event Loop: <em>"Remind me when this is done."</em> Then, V8 instantly moves to the next line of code.
        </p>
        
        <div className="not-prose my-6">
          <SyntaxHoverCode code={basicExample} />
        </div>

        <h3 id="real-world-example" className="text-2xl mt-12 mb-4">The Real-World Example</h3>
        <p>
          Let's look at how this applies to our <strong>Real-time P2P File Sync Engine</strong>.
        </p>
        <p>
          The Event Loop doesn't just do tasks randomly; it executes them in specific <strong>phases</strong>. First it checks expiring <Link href="#timers">Timers</Link> (like <code>setTimeout</code>), then it checks for <Link href="#io">I/O callbacks</Link> (like a file being saved or a network packet arriving). 
        </p>

        <div className="not-prose my-6">
          <SyntaxHoverCode code={advancedExample} />
        </div>
        <p>
          Because of the Event Loop, our engine can send a heartbeat ping every 5 seconds, watch thousands of files, and listen for incoming WebRTC messages all at the exact same time—without ever freezing!
        </p>
      </section>

      {/* Navigation Footer */}
      <section className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link 
          href="/1-what-is-nodejs"
          className="group flex items-center px-4 py-2.5 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors w-full sm:w-auto"
        >
          <span className="text-text-muted mr-3 transition-transform group-hover:-translate-x-1">←</span>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Back</span>
            <span className="text-[13px] font-medium text-foreground">1. What is Node.js</span>
          </div>
        </Link>

        <Link 
          href="/3-nexttick-vs-setimmediate"
          className="group flex items-center px-4 py-2.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors w-full sm:w-auto text-right justify-end"
        >
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-primary-dark font-semibold">What's Next</span>
            <span className="text-[13px] font-medium text-primary-dark">3. nextTick vs setImmediate</span>
          </div>
          <span className="text-primary-dark ml-3 transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </section>
    </div>
  );
}
