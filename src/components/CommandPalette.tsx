'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAI } from '@/context/AIContext';
import { topicsData } from '@/data/topics';
import { usePathname, useRouter } from 'next/navigation';

export default function CommandPalette() {
  const { isSearchOpen, setSearchOpen, addInjection, isLoading, setIsLoading } = useAI();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const topic = topicsData.find(t => '/' + t.slug === pathname);

  const extractText = (node: any): string => {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (node && node.props && node.props.children) {
      return extractText(node.props.children);
    }
    return '';
  };

  // Close on Escape, handle global Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery('');
      setSelectedIndex(0);
      setError(null);
    }
  }, [isSearchOpen]);

  // Fuzzy Search Logic
  const filteredTopics = query.trim() === '' 
    ? topicsData.slice(0, 5) // Show top 5 default suggestions when empty
    : topicsData.filter(t => 
        t.title.toLowerCase().includes(query.toLowerCase()) || 
        t.shortTitle.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);

  const hasAIAction = query.trim().length > 0;
  const isProjectMode = pathname === '/project-mode';
  const showProjectMode = !isProjectMode && (query.trim() === '' || query.toLowerCase().includes('project'));
  const totalOptions = filteredTopics.length + (hasAIAction ? 1 : 0) + (showProjectMode ? 1 : 0);

  // Handle Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % totalOptions);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalOptions) % totalOptions);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeSelection();
    }
  };

  const handleAskAI = async () => {
    if (!query.trim() || !topic) {
      setError("Please navigate to a specific topic before asking the AI.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const topicContext = {
        title: topic.title,
        description: topic.description,
        paragraphCount: topic.paragraphs ? topic.paragraphs.length : 0,
        paragraphs: (topic.paragraphs || []).map(extractText),
        advancedParagraphs: (topic.advancedParagraphs || []).map(extractText),
        basicExample: topic.basicExample || `// Placeholder Basic Example\nconsole.log("This is a placeholder for ${topic.shortTitle}");`,
        advancedExample: topic.advancedExample || `// Placeholder Real-World Example\n// Our File Sync Engine...\nfunction sync() {\n  console.log("Syncing ${topic.shortTitle}...");\n}`
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://magnm-documentation.onrender.com';
      const res = await fetch(`${apiUrl}/api/ai/generate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, topicContext }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate AI response');
      }

      addInjection(topic.slug, data);
      setSearchOpen(false);
    } catch (err: any) {
      console.error("AI Error:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const executeSelection = () => {
    if (totalOptions === 0) return;
    
    if (hasAIAction && selectedIndex === 0) {
      handleAskAI();
    } else if (showProjectMode && selectedIndex === (hasAIAction ? 1 : 0)) {
      router.push('/project-mode');
      setSearchOpen(false);
    } else {
      const topicIndex = selectedIndex - (hasAIAction ? 1 : 0) - (showProjectMode ? 1 : 0);
      const selectedTopic = filteredTopics[topicIndex];
      if (selectedTopic) {
        router.push(`/${selectedTopic.slug}`);
        setSearchOpen(false);
      }
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => !isLoading && setSearchOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-background border border-border rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden animate-fade-in-up">
        
        {/* Search Input */}
        <div className="flex items-center px-6 py-6 border-b border-border">
          <svg className="w-6 h-6 text-text-muted mr-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none outline-none text-foreground text-lg sm:text-xl placeholder:text-text-muted/60"
            placeholder="Ask AI to update the page or search for page"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          {isLoading && (
            <svg className="w-5 h-5 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <div className="ml-3 text-[10px] text-text-muted border border-border px-1.5 py-0.5 rounded">ESC</div>
        </div>

        {/* Loading State / Error */}
        {isLoading && (
          <div className="px-5 py-8 text-center border-b border-border bg-primary/5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary mb-3">
              <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <p className="text-sm font-medium text-foreground">AI is thinking...</p>
            <p className="text-xs text-text-muted mt-1">Analyzing context and generating insights.</p>
          </div>
        )}

        {error && (
          <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/20 text-red-600 text-[13px]">
            {error}
          </div>
        )}

        {/* Results List */}
        {!isLoading && (
          <div className="max-h-[60vh] overflow-y-auto py-3">
            
            {/* AI Action Item */}
            {hasAIAction && (
              <div 
                className={`px-6 py-4 cursor-pointer flex items-center ${selectedIndex === 0 ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-black/[0.02] border-l-4 border-transparent'}`}
                onClick={handleAskAI}
                onMouseEnter={() => setSelectedIndex(0)}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary mr-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <p className="text-[14px] font-medium text-foreground">Ask AI: "{query}"</p>
                  <p className="text-[12px] text-text-muted">Generate dynamic explanations on this page</p>
                </div>
              </div>
            )}

            {/* Project Mode Item */}
            {showProjectMode && (
              <div 
                className={`px-6 py-4 cursor-pointer flex items-center ${selectedIndex === (hasAIAction ? 1 : 0) ? 'bg-green-500/10 border-l-4 border-green-500' : 'hover:bg-black/[0.02] border-l-4 border-transparent'}`}
                onClick={() => {
                  router.push('/project-mode');
                  setSearchOpen(false);
                }}
                onMouseEnter={() => setSelectedIndex(hasAIAction ? 1 : 0)}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/20 text-green-600 mr-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <div>
                  <p className="text-[14px] font-medium text-foreground">Learn by Project</p>
                  <p className="text-[12px] text-text-muted">Master Node.js by building a collaborative text editor</p>
                </div>
              </div>
            )}

            {filteredTopics.length > 0 && (
              <div className="px-6 pt-4 pb-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                {query.trim() === '' ? 'Suggested Topics' : 'Topics'}
              </div>
            )}

            {/* Topic Results */}
            {filteredTopics.map((t, idx) => {
              const actualIndex = (hasAIAction ? 1 : 0) + (showProjectMode ? 1 : 0) + idx;
              const isSelected = selectedIndex === actualIndex;
              return (
                <div
                  key={t.slug}
                  className={`px-6 py-4 cursor-pointer flex flex-col justify-center ${isSelected ? 'bg-black/[0.04] dark:bg-white/[0.04] border-l-4 border-foreground' : 'hover:bg-black/[0.02] border-l-4 border-transparent'}`}
                  onClick={() => {
                    router.push(`/${t.slug}`);
                    setSearchOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(actualIndex)}
                >
                  <p className="text-[14px] font-medium text-foreground">{t.title}</p>
                  <p className="text-[12px] text-text-muted line-clamp-1">{t.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
