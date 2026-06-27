import React from 'react';
import SyntaxHoverCode from '@/components/SyntaxHoverCode';
import Link from 'next/link';
import { topicsData } from '@/data/topics';

export default function Home() {
  const codeExample = `const { spawn } = require('child_process');

// A common pattern in VS Code extensions
const gitProcess = spawn('git', ['status']);

gitProcess.stdout.on('data', (data) => {
  console.log(\`Output: \${data}\`);
});

gitProcess.on('close', (code) => {
  console.log(\`Process exited with code \${code}\`);
});`;

  // Group topics by section
  const sectionsMap = new Map<string, typeof topicsData>();
  topicsData.forEach(topic => {
    if (!sectionsMap.has(topic.section)) {
      sectionsMap.set(topic.section, []);
    }
    sectionsMap.get(topic.section)!.push(topic);
  });

  const sectionTitles = Array.from(sectionsMap.keys());
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

  return (
    <div className="flex flex-col pb-24 overflow-x-hidden w-full max-w-full">
      {/* Hero Section */}
      <section id="overview" className="relative pt-2 pb-12 border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <h1 className="font-serif text-[28px] sm:text-4xl md:text-[44px] lg:text-[52px] font-medium text-foreground mb-6 leading-[1.15] tracking-tight relative z-10">
          Master Node.js <em className="not-italic text-primary-dark">Systems</em> Programming
        </h1>
        
        <p className="text-[15px] sm:text-base text-text-secondary max-w-xl leading-[1.8] mb-10 relative z-10">
          An advanced, 40-step path covering everything from the V8 Engine and Libuv to true multithreading, binary streams, and WebRTC peer-to-peer architecture.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <Link 
            href="/1-what-is-node-js-really"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium transition-colors shadow-sm text-[13px] tracking-wide"
          >
            Start Topic 1
          </Link>
          <a 
            href="#topics"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-card border border-border hover:border-primary/40 text-foreground font-medium transition-colors text-[13px] tracking-wide"
          >
            View Syllabus
          </a>
        </div>
      </section>

      {/* Interactive Code Example */}
      <section id="interactive-example" className="py-12 border-b border-border">
        <div className="mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-3">
            Hover to Understand
          </h2>
          <p className="text-[13px] sm:text-[14px] text-text-secondary leading-[1.8] max-w-2xl">
            Hover over any highlighted keyword — from basics like <code>const</code> to advanced patterns like <code>.stdout</code>, <code>.on()</code>, and event names.
          </p>
        </div>

        <div className="w-full max-w-full overflow-hidden">
          <SyntaxHoverCode code={codeExample} />
        </div>
      </section>

      {/* 40 Topics Index */}
      <section id="topics" className="pt-8">
        <div className="mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-2">
            The Complete Path
          </h2>
          <p className="text-[13px] text-text-muted">40 essential topics to master Node.js systems programming.</p>
        </div>

        <div className="space-y-5">
          {sectionTitles.map((sectionTitle, idx) => {
            const sectionTopics = sectionsMap.get(sectionTitle)!;
            return (
              <div key={idx} className="bg-card border border-border rounded-2xl p-4 sm:p-8 hover:shadow-sm transition-shadow duration-300">
                <div className="flex items-baseline mb-1">
                  <span className="font-serif text-[13px] text-primary-dark font-medium mr-3">{romanNumerals[idx] || (idx+1)}.</span>
                  <h3 className="font-serif text-xl font-medium text-foreground">{sectionTitle}</h3>
                </div>
                <p className="text-[13px] text-text-muted mb-6 ml-0 sm:ml-8">Core concepts for this module.</p>
                
                <ul className="space-y-0 ml-0 sm:ml-8">
                  {sectionTopics.map((topic) => {
                    return (
                      <li key={topic.id} className="group flex items-start text-[13px] border-b border-border/60 last:border-0">
                        <Link href={`/${topic.slug}`} className="flex items-start w-full py-3 text-text-secondary group-hover:text-foreground transition-colors duration-200">
                          <span className="text-text-muted text-[12px] font-mono w-7 shrink-0 mt-px">{String(topic.id).padStart(2, '0')}</span>
                          <span className="font-medium">{topic.title}</span>
                          <span className="ml-auto text-text-muted opacity-0 group-hover:opacity-100 transition-opacity text-[11px] pl-4">→</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
