'use client';

import React from 'react';
import SyntaxHoverCode from '@/components/SyntaxHoverCode';
import Quiz from '@/components/Quiz';
import Link from 'next/link';
import TypewriterText from '@/components/TypewriterText';
import { topicsData } from '@/data/topics';
import { useAI } from '@/context/AIContext';

export default function TopicTemplate({ id }: { id: number | string }) {
  const { injections, addInjection, undoInjection, clearInjections } = useAI();
  const [isTLDRMode, setIsTLDRMode] = React.useState(false);
  const [isGeneratingTLDR, setIsGeneratingTLDR] = React.useState(false);
  
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

  const extractText = (node: any): string => {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (node && node.props && node.props.children) {
      return extractText(node.props.children);
    }
    return '';
  };

  const generateTLDR = async () => {
    if (!topic) return;
    setIsGeneratingTLDR(true);
    try {
      const topicContext = {
        title: topic.title,
        description: topic.description,
        paragraphCount: topic.paragraphs ? topic.paragraphs.length : 0,
        paragraphs: (topic.paragraphs || []).map(extractText),
        advancedParagraphs: (topic.advancedParagraphs || []).map(extractText),
        basicExample,
        advancedExample
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://magnm-documentation.onrender.com';
      const res = await fetch(`${apiUrl}/api/ai/generate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: "Generate a dense, bullet-point TL;DR summary of this entire page.", topicContext }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate TLDR');
      
      if (data.tldr) {
        addInjection(topic.slug, data);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate TLDR. Please try again.");
    } finally {
      setIsGeneratingTLDR(false);
    }
  };

  const latestTLDR = history.slice().reverse().find(inj => inj.tldr)?.tldr;

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

        {/* TLDR Toggle Switch */}
        <div className="flex items-center my-6">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={isTLDRMode} onChange={(e) => setIsTLDRMode(e.target.checked)} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            <span className="ml-3 text-sm font-medium text-foreground flex items-center">
              <svg className="w-4 h-4 mr-1 text-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              AI TL;DR Mode
            </span>
          </label>
        </div>
        
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
        
        {isTLDRMode ? (
          <div className="animate-fade-in">
            {latestTLDR ? (
              <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-r-lg">
                <h3 className="text-primary font-bold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  Page TL;DR Summary
                </h3>
                <div className="prose prose-sm dark:prose-invert">
                  <TypewriterText text={latestTLDR} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-black/[0.02] dark:bg-white/[0.02] rounded-xl border border-dashed border-border">
                <svg className="w-12 h-12 text-primary/50 mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                <p className="text-text-muted mb-4 text-center max-w-sm">No TL;DR exists for this page yet. Click below to use AI to read the entire page and generate a dense summary.</p>
                <button 
                  onClick={generateTLDR} 
                  disabled={isGeneratingTLDR}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center"
                >
                  {isGeneratingTLDR ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Reading Page...
                    </>
                  ) : 'Generate TL;DR'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {topic.paragraphs ? (
          topic.paragraphs.map((p, i) => (
            <React.Fragment key={i}>
              {p}
              {/* AI Inline Injection */}
              {history.flatMap(inj => inj.inlineExplanations || [])
                .filter(exp => exp.paragraphIndex === i)
                .map((exp, j) => (
                <div key={`exp-${i}-${j}`} className="not-prose my-6 font-medium">
                  <div className="flex items-center text-primary dark:text-primary-light mb-1 uppercase tracking-wider text-[11px] font-bold">
                    <svg className="w-3.5 h-3.5 mr-1.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    AI Added Content
                  </div>
                  <TypewriterText text={exp.text} className="text-[16px] text-primary-dark dark:text-primary font-bold italic" />
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
          {(() => {
            const replacement = history.flatMap(inj => inj.replacements || []).reverse().find(r => r.target === 'basicExample');
            if (replacement) {
              return (
                <div className="relative flex flex-col gap-4">
                  <div className="relative">
                    <div className="absolute -top-3 -right-3 z-10 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md animate-bounce">
                      AI Replaced
                    </div>
                    <SyntaxHoverCode code={replacement.text.replace(/```[a-z]*\n?/g, '').replace(/```/g, '')} />
                  </div>
                  {replacement.explanation && (
                    <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg mt-2 font-medium">
                      <div className="flex items-center text-primary mb-1 uppercase tracking-wider text-[11px] font-bold">
                        <svg className="w-3.5 h-3.5 mr-1.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Code Explanation
                      </div>
                      <TypewriterText text={replacement.explanation} className="text-[15px] text-primary-dark dark:text-primary font-bold italic" />
                    </div>
                  )}
                </div>
              );
            }
            return <SyntaxHoverCode code={basicExample} />;
          })()}
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
          {(() => {
            const replacement = history.flatMap(inj => inj.replacements || []).reverse().find(r => r.target === 'advancedExample');
            if (replacement) {
              return (
                <div className="relative flex flex-col gap-4">
                  <div className="relative">
                    <div className="absolute -top-3 -right-3 z-10 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md animate-bounce">
                      AI Replaced
                    </div>
                    <SyntaxHoverCode code={replacement.text.replace(/```[a-z]*\n?/g, '').replace(/```/g, '')} />
                  </div>
                  {replacement.explanation && (
                    <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg mt-2 font-medium">
                      <div className="flex items-center text-primary mb-1 uppercase tracking-wider text-[11px] font-bold">
                        <svg className="w-3.5 h-3.5 mr-1.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Code Explanation
                      </div>
                      <TypewriterText text={replacement.explanation} className="text-[15px] text-primary-dark dark:text-primary font-bold italic" />
                    </div>
                  )}
                </div>
              );
            }
            return <SyntaxHoverCode code={advancedExample} />;
          })()}
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

        {/* AI New Sections */}
        {history.flatMap(inj => inj.newSections || []).map((sec, idx) => (
          <div key={`new-sec-${idx}`} className="mt-12 animate-fade-in-up">
            <h3 className="text-2xl mb-4 text-primary-dark dark:text-primary flex items-center">
              <svg className="w-5 h-5 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              {sec.title}
            </h3>
            <div className="text-[15px] text-primary-dark dark:text-primary-light italic leading-[1.8]">
              <TypewriterText text={sec.content} />
            </div>
          </div>
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
