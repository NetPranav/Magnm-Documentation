import React from 'react';
import SyntaxHoverCode from '@/components/SyntaxHoverCode';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3. nextTick vs setImmediate | Magnum Documentation',
  description: 'Understanding the microtask queue and timer phases.',
};

export default function NextTickVsSetImmediate() {
  const basicExample = `console.log("1. Start");

setImmediate(() => {
  console.log("4. setImmediate runs in the Check phase.");
});

process.nextTick(() => {
  console.log("3. nextTick runs immediately after current operation!");
});

console.log("2. End");`;

  const advancedExample = `// Inside our File Sync Engine...

function broadcastSync(file) {
  // If we notice a critical error, we want to handle it BEFORE
  // moving on to the next phase of the Event Loop.
  if (!file) {
    process.nextTick(() => {
      console.error('CRITICAL: Sync failed, file missing!');
    });
    return;
  }

  // Normal broadcasting is placed at the end of the loop 
  // so we don't delay other I/O operations.
  setImmediate(() => {
    sendWebRTCMessage({ type: 'SYNC', data: file });
  });
}

broadcastSync(null);`;

  return (
    <div className="flex flex-col pb-24 overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section id="overview" className="relative pt-2 pb-8 border-b border-border">
        <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-medium mb-6">
          Topic 3
        </p>
        <h1 className="font-serif text-[28px] sm:text-4xl md:text-[44px] lg:text-[52px] font-medium text-foreground mb-6 leading-[1.15] tracking-tight">
          nextTick vs <em className="not-italic text-primary-dark">setImmediate</em>
        </h1>
        <p className="text-[15px] text-text-secondary max-w-xl leading-[1.8] mb-4">
          How to tell Node.js exactly <em>when</em> to prioritize your asynchronous code inside the Event Loop.
        </p>
      </section>

      {/* Content Section */}
      <section id="content" className="py-8 prose prose-slate max-w-none prose-p:text-[15px] prose-p:text-text-secondary prose-p:leading-[1.8] prose-headings:font-serif prose-headings:font-medium prose-headings:text-foreground prose-a:text-primary-dark prose-a:no-underline hover:prose-a:underline">
        <p>
          In the last topic, we learned that the Event Loop spins in phases. But sometimes, you need absolute control over exactly <em>when</em> a piece of code runs. This is where <code>process.nextTick()</code> and <code>setImmediate()</code> come in, and despite their names, they do the exact opposite of what you might think.
        </p>

        <ul className="list-disc pl-5 text-[15px] text-text-secondary leading-[1.8] space-y-2 mb-8">
          <li><strong>process.nextTick():</strong> This says, <em>"Stop everything and run this the exact millisecond the current operation finishes!"</em> It doesn't wait for the next phase; it cuts in line.</li>
          <li><strong>setImmediate():</strong> This says, <em>"Run this eventually, but only after you finish all current I/O tasks."</em> It politely waits for the 'Check' phase of the Event Loop.</li>
        </ul>

        <h3 id="basic-example" className="text-2xl mt-10 mb-4">The Basic Example</h3>
        <p>
          Let's look at a simple race. Even though <code>setImmediate</code> is written first, <code>process.nextTick</code> will always cut in line and win the race.
        </p>
        
        <div className="not-prose my-6">
          <SyntaxHoverCode code={basicExample} />
        </div>

        <h3 id="real-world-example" className="text-2xl mt-12 mb-4">The Real-World Example</h3>
        <p>
          Let's apply this to our <strong>Real-time P2P File Sync Engine</strong>.
        </p>
        <p>
          Imagine we are preparing to broadcast a file over WebRTC, but we realize the file doesn't exist. We want to log that critical error <em>immediately</em> before doing anything else. However, if the file is fine, we want to send it over WebRTC using <code>setImmediate()</code> so we don't accidentally freeze the engine from reading other incoming files.
        </p>

        <div className="not-prose my-6">
          <SyntaxHoverCode code={advancedExample} />
        </div>
        <p>
          By mastering these two functions, you get microscopic control over the Event Loop's timing, ensuring your heavy operations never block your critical ones!
        </p>
      </section>

      {/* Navigation Footer */}
      <section className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link 
          href="/2-the-event-loop"
          className="group flex items-center px-4 py-2.5 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors w-full sm:w-auto"
        >
          <span className="text-text-muted mr-3 transition-transform group-hover:-translate-x-1">←</span>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Back</span>
            <span className="text-[13px] font-medium text-foreground">2. The Event Loop</span>
          </div>
        </Link>

        <Link 
          href="#"
          className="group flex items-center px-4 py-2.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors w-full sm:w-auto text-right justify-end"
        >
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-primary-dark font-semibold">What's Next</span>
            <span className="text-[13px] font-medium text-primary-dark">4. Memory & GC</span>
          </div>
          <span className="text-primary-dark ml-3 transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </section>
    </div>
  );
}
