'use client';

import React from 'react';
import SyntaxHoverCode from '@/components/SyntaxHoverCode';
import Quiz from '@/components/Quiz';
import Link from 'next/link';
import { topicsData } from '@/data/topics';
import { useAI } from '@/context/AIContext';

export default function TopicTemplate({ id }: { id: number | string }) {
  const { injections, undoInjection, clearInjections } = useAI();
  const currentIndex = topicsData.findIndex(t => t.id === id);
  const topic = currentIndex !== -1 ? topicsData[currentIndex] : undefined;
  
  // Ensure history is an array (backwards compatibility with old localStorage/DB objects)
  const rawHistory = topic ? (injections[topic.slug] || []) : [];
  const history = Array.isArray(rawHistory) ? rawHistory : [rawHistory];

  const nextTopic = currentIndex !== -1 && currentIndex < topicsData.length - 1 ? topicsData[currentIndex + 1] : undefined;
  const prevTopic = currentIndex > 0 ? topicsData[currentIndex - 1] : undefined;

  if (!topic) return <div>Topic not found</div>;

  const basicExample = topic.basicExample || `// Placeholder Basic Example
console.log("This is a placeholder for ${topic.shortTitle}");`;

  const advancedExample = topic.advancedExample || `// Placeholder Real-World Example
// Our File Sync Engine...
function sync() {
  console.log("Syncing ${topic.shortTitle}...");
}`;

  return (
    <div className="flex flex-col pb-24 overflow-x-hidden w-full max-w-full relative">
      
      {/* AI Controls Overlay */}
      {topic && history.length > 0 && (
        <div className="absolute top-2 right-0 flex items-center space-x-2 z-10 animate-fade-in">
          <button 
            onClick={() => undoInjection(topic.slug)}
            title="Undo last AI injection"
            className="flex items-center px-3 py-1.5 bg-background border border-border rounded-lg text-[12px] font-medium text-text-muted hover:text-foreground hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Undo (1)
          </button>
          <button 
            onClick={() => clearInjections(topic.slug)}
            title="Clear all AI injections on this page"
            className="flex items-center p-1.5 bg-background border border-border rounded-lg text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section id="overview" className="relative pt-2 pb-8 border-b border-border">
        <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-medium mb-6">
          Topic {topic.id}
        </p>
        <h1 className="font-serif text-[28px] sm:text-4xl md:text-[44px] lg:text-[52px] font-medium text-foreground mb-4 leading-[1.15] tracking-tight">
          {topic.title}
        </h1>
        {topic.difficulty && (
          <div className="mb-6 flex items-center">
            <span className={`text-[12px] px-3 py-1 rounded-full font-medium ${
              topic.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
              topic.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
              'bg-red-500/10 text-red-600 dark:text-red-400'
            }`}>
              {topic.difficulty}
            </span>
          </div>
        )}
        <p className="text-[15px] text-text-secondary max-w-xl leading-[1.8] mb-4">
          {topic.description || `A simple breakdown of ${topic.shortTitle}.`}
        </p>
        
        {/* AI Summary Injections */}
        {history.map((inj, idx) => inj.summary && (
          <div key={`summary-${idx}`} className="mt-8 p-5 rounded-xl bg-primary/10 border-l-4 border-primary text-[14.5px] text-foreground shadow-sm animate-fade-in-up">
            <div className="font-bold text-primary mb-2 flex items-center uppercase tracking-wider text-xs">
              <svg className="w-4 h-4 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              AI Context Summary {history.length > 1 ? `(${idx + 1})` : ''}
            </div>
            {inj.summary}
          </div>
        ))}
      </section>

      {/* Architectural Image (If Provided) */}
      {topic.imageUrl && (
        <section id="architecture" className="mb-10 flex justify-center">
          <div className="rounded-xl overflow-hidden border border-border bg-white shadow-sm max-w-[600px] w-full p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={topic.imageUrl} 
              alt={topic.imageAlt || "Architecture diagram"} 
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
        </section>
      )}

      {/* Content Section */}
      <section id="content" className="py-8 prose prose-slate max-w-none prose-p:text-[15px] prose-p:text-text-secondary prose-p:leading-[1.8] prose-headings:font-serif prose-headings:font-medium prose-headings:text-foreground prose-a:text-primary-dark prose-a:no-underline hover:prose-a:underline">
        
        {topic.paragraphs ? (
          topic.paragraphs.map((p, i) => (
            <React.Fragment key={i}>
              {p}
              {/* AI Inline Injection */}
              {history.flatMap(inj => inj.inlineExplanations || [])
                .filter(exp => exp.paragraphIndex === i)
                .map((exp, j) => (
                <div key={`exp-${i}-${j}`} className="not-prose my-6 p-5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[14px] text-foreground animate-fade-in-up shadow-sm">
                  <div className="font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center uppercase tracking-wider text-xs">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    Deep Dive
                  </div>
                  {exp.text}
                </div>
              ))}
            </React.Fragment>
          ))
        ) : (
          <>
            <p>
              This is a placeholder content block for <strong>{topic.shortTitle}</strong>. We are scaffolding the documentation right now, so the deep technical details will be filled in shortly.
            </p>
            <p>
              In Node.js, {topic.shortTitle.toLowerCase()} is an essential concept for building robust architectures like our File Sync Engine.
            </p>
          </>
        )}

        <h3 id="basic-example" className="text-2xl mt-10 mb-4">The Basic Example</h3>
        <p>
          Here is a bare-minimum syntax example to show how this works in isolation.
        </p>
        
        <div className="not-prose my-6">
          <SyntaxHoverCode code={basicExample} />
        </div>

        <h3 id="real-world-example" className="text-2xl mt-12 mb-4">{topic.advancedTitle || "The Real-World Example"}</h3>
        
        {topic.advancedParagraphs ? (
          topic.advancedParagraphs.map((p, i) => <React.Fragment key={i}>{p}</React.Fragment>)
        ) : (
          <p>
            Let's apply this to our <strong>Real-time P2P File Sync Engine</strong>. When we need to implement {topic.shortTitle.toLowerCase()}, this is how we would structure it so it doesn't block the Event Loop.
          </p>
        )}

        <div className="not-prose my-6">
          <SyntaxHoverCode code={advancedExample} />
        </div>

        {/* Extra Examples (For Massive Core Topics) */}
        {topic.extraExamples && topic.extraExamples.map((example, index) => (
          <React.Fragment key={`extra-${index}`}>
            <h3 id={`extra-example-${index}`} className="text-2xl mt-12 mb-4">
              {example.title}
            </h3>
            {example.paragraphs.map((p, i) => (
              <React.Fragment key={`extra-p-${i}`}>{p}</React.Fragment>
            ))}
            <div className="not-prose my-6">
              <SyntaxHoverCode code={example.code} />
            </div>
          </React.Fragment>
        ))}

        {/* Module Capstone Mini-Project */}
        {topic.miniProject && (
          <div id="capstone" className="mt-16 mb-8 p-8 rounded-2xl bg-primary/5 border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <svg className="w-24 h-24 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Module Capstone Project</h2>
            <h3 className="text-2xl font-serif font-medium text-foreground mb-4">{topic.miniProject.title}</h3>
            <div className="text-text-secondary leading-relaxed mb-6 max-w-2xl">
              {topic.miniProject.description}
            </div>
            {topic.miniProject.code && (
              <div className="not-prose">
                <SyntaxHoverCode code={topic.miniProject.code} />
              </div>
            )}
          </div>
        )}

        {/* Interactive Quiz */}
        {topic.quiz && (
          <div id="quiz">
            <Quiz 
              title={topic.quiz.title || "Module Knowledge Check"}
              questions={topic.quiz.questions}
            />
          </div>
        )}
      </section>

      {/* Navigation Footer */}
      <section className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevTopic ? (
          <Link 
            href={`/${prevTopic.slug}`}
            className="group flex items-center px-4 py-2.5 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors w-full sm:w-auto"
          >
            <span className="text-text-muted mr-3 transition-transform group-hover:-translate-x-1">←</span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Back</span>
              <span className="text-[13px] font-medium text-foreground">{prevTopic.id}. {prevTopic.shortTitle}</span>
            </div>
          </Link>
        ) : (
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
        )}

        {nextTopic && (
          <Link 
            href={`/${nextTopic.slug}`}
            className="group flex items-center px-4 py-2.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors w-full sm:w-auto text-right justify-end"
          >
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-primary-dark font-semibold">What's Next</span>
              <span className="text-[13px] font-medium text-primary-dark">{nextTopic.id}. {nextTopic.shortTitle}</span>
            </div>
            <span className="text-primary-dark ml-3 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        )}
      </section>
    </div>
  );
}
