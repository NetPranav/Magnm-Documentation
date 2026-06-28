'use client';

import React, { useState, useEffect } from 'react';
import { useAI } from '@/context/AIContext';
import { usePathname } from 'next/navigation';

export default function SearchTrigger() {
  const { setSearchOpen } = useAI();
  const [showHint, setShowHint] = useState(true);
  const pathname = usePathname();

  // Show the hint every time the user changes the page
  useEffect(() => {
    setShowHint(true);
  }, [pathname]);

  return (
    <div className="relative flex flex-col items-end w-full">
      <div 
        className="flex items-center justify-between px-2.5 sm:px-4 py-1.5 sm:py-2 w-full sm:w-80 rounded-xl border border-border text-text-muted text-xs sm:text-sm hover:border-primary/40 hover:text-foreground transition-colors cursor-pointer bg-background shadow-sm hover:shadow-md"
        onClick={() => setSearchOpen(true)}
      >
        <div className="flex items-center overflow-hidden">
          <svg className="w-3.5 h-3.5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="truncate">Search docs or ask AI...</span>
        </div>
        <span className="ml-3 text-[10px] border border-border rounded px-1.5 py-0.5 bg-black/[0.02] dark:bg-white/[0.02] font-mono shrink-0 hidden sm:inline-block">⌘K</span>
      </div>

      {/* Permanent subtle hint pointing up */}
      {showHint && (
        <div className="absolute top-full mt-2 right-4 flex flex-col items-center animate-fade-in-up z-50">
          {/* Arrow pointing up */}
          <svg className="w-4 h-4 text-primary animate-bounce mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          
          {/* Text and Close button */}
          <div className="flex items-center bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
            <span className="text-xs font-semibold mr-2">Ask AI to customize this page</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowHint(false);
              }}
              className="text-primary hover:text-primary/70 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
