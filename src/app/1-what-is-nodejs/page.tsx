import React from 'react';
import SyntaxHoverCode from '@/components/SyntaxHoverCode';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '1. What is Node.js really? | Magnum Documentation',
  description: 'A simple breakdown of the V8 Engine and Libuv.',
};

export default function WhatIsNodeJS() {
  const basicExample = `// A simple script
const message = "Hello, V8!";
console.log(message);`;

  const advancedExample = `const fs = require('fs');

// Our File Sync Engine watches a folder
// fs.watch uses Libuv to ask the OS to notify us of changes,
// so the V8 engine isn't blocked waiting for files to save.
fs.watch('./my-project', (eventType, filename) => {
  console.log(\`File \${filename} changed! Event: \${eventType}\`);
  // Next step: read the file and sync via WebRTC...
});

console.log('Watching for changes... (main thread is free!)');`;

  return (
    <div className="flex flex-col pb-24 overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section id="overview" className="relative pt-2 pb-8 border-b border-border">
        <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-medium mb-6">
          Topic 1
        </p>
        <h1 className="font-serif text-[28px] sm:text-4xl md:text-[44px] lg:text-[52px] font-medium text-foreground mb-6 leading-[1.15] tracking-tight">
          What is Node.js <em className="not-italic text-primary-dark">really?</em>
        </h1>
        <p className="text-[15px] text-text-secondary max-w-xl leading-[1.8] mb-4">
          A ridiculously simple breakdown of the two engines that power Node.js: <strong>V8</strong> and <strong>Libuv</strong>.
        </p>
      </section>

      {/* Content Section */}
      <section id="content" className="py-8 prose prose-slate max-w-none prose-p:text-[15px] prose-p:text-text-secondary prose-p:leading-[1.8] prose-headings:font-serif prose-headings:font-medium prose-headings:text-foreground prose-a:text-primary-dark prose-a:no-underline hover:prose-a:underline">
        <p>
          If you open a browser, JavaScript runs inside it. But what if you want to run JavaScript directly on your computer, without a browser? That's what Node.js is. 
        </p>
        <p>
          Node.js is not a programming language. It is simply a wrapper around two massive engines that do all the heavy lifting:
        </p>

        <ul className="list-disc pl-5 text-[15px] text-text-secondary leading-[1.8] space-y-2 mb-8">
          <li><strong>The V8 Engine:</strong> Created by Google. It reads your JavaScript code and translates it into machine code that your computer's processor can instantly execute.</li>
          <li><strong>Libuv:</strong> A library written in C. It handles all the "slow" stuff like reading <Link href="#file-system">files</Link>, waiting for <Link href="#networking">network requests</Link>, or setting timers. It does this in the background so V8 doesn't have to wait.</li>
        </ul>

        <h3 id="basic-example" className="text-2xl mt-10 mb-4">The Basic Example</h3>
        <p>
          When you write standard JavaScript, the <strong>V8 engine</strong> does all the work. It reads line 1, executes it, then moves to line 2.
        </p>
        
        <div className="not-prose my-6">
          <SyntaxHoverCode code={basicExample} />
        </div>

        <h3 id="real-world-example" className="text-2xl mt-12 mb-4">The Real-World Example</h3>
        <p>
          Let's look at how this applies to our running example: <strong>The Real-time P2P File Sync Engine</strong>.
        </p>
        <p>
          If we want to sync files across computers, we need to know the exact moment a file is saved. If V8 had to sit and stare at a file waiting for it to change, your entire app would freeze. Instead, we use a Node.js <Link href="#modules">module</Link> (like <code>fs</code>) to hand the job off to <strong>Libuv</strong>. Libuv quietly asks your Operating System to watch the folder in the background.
        </p>

        <div className="not-prose my-6">
          <SyntaxHoverCode code={advancedExample} />
        </div>
        <p>
          Because Libuv handles the watching, the main thread is totally free to do other things (like accepting incoming WebRTC connections)!
        </p>
      </section>

      {/* Navigation Footer */}
      <section className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link 
          href="/"
          className="group flex items-center px-4 py-2.5 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors w-full sm:w-auto"
        >
          <span className="text-text-muted mr-3 transition-transform group-hover:-translate-x-1">←</span>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Back</span>
            <span className="text-[13px] font-medium text-foreground">Overview</span>
          </div>
        </Link>

        <Link 
          href="/2-the-event-loop"
          className="group flex items-center px-4 py-2.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors w-full sm:w-auto text-right justify-end"
        >
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-primary-dark font-semibold">What's Next</span>
            <span className="text-[13px] font-medium text-primary-dark">2. The Event Loop</span>
          </div>
          <span className="text-primary-dark ml-3 transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </section>
    </div>
  );
}
