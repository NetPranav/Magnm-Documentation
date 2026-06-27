'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ResponsiveLayoutProps {
  leftSidebar: React.ReactNode;
  rightSidebar: React.ReactNode;
  children: React.ReactNode;
}

export default function ResponsiveLayout({
  leftSidebar,
  rightSidebar,
  children,
}: ResponsiveLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const touchRef = useRef({ startX: 0, startY: 0 });

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // Swipe gesture detection
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchRef.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
    };
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchRef.current.startX;
      const dy = e.changedTouches[0].clientY - touchRef.current.startY;
      const startX = touchRef.current.startX;

      // Must be a primarily horizontal swipe
      if (Math.abs(dx) < Math.abs(dy) * 1.3) return;
      // Minimum swipe distance
      if (Math.abs(dx) < 40) return;

      if (dx > 0 && !sidebarOpen) {
        // Swipe RIGHT to open sidebar
        // Start zone: <150px from left edge
        if (startX < 150) {
          setSidebarOpen(true);
        }
      } else if (dx < 0 && sidebarOpen) {
        // Swipe LEFT to close sidebar
        setSidebarOpen(false);
      }
    },
    [sidebarOpen]
  );

  useEffect(() => {
    // Only attach swipe listeners on small screens
    const mq = window.matchMedia('(max-width: 1023px)');
    const attach = () => {
      if (mq.matches) {
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
      } else {
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchend', handleTouchEnd);
        setSidebarOpen(false);
      }
    };
    attach();
    mq.addEventListener('change', attach);
    return () => {
      mq.removeEventListener('change', attach);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return (
    <div className="flex flex-1 max-w-[1400px] w-full mx-auto relative">
      {/* ── Mobile Hamburger ── */}
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        className="lg:hidden fixed top-3 left-3 z-[60] p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-sidebar transition-colors"
        aria-label="Toggle navigation"
      >
        <svg
          className="w-5 h-5 text-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {sidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M4 6h16M4 12h12M4 18h8"
            />
          )}
        </svg>
      </button>

      {/* ── Backdrop ── */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/15 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${
          sidebarOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Left Sidebar ── */}
      <aside
        className={`
          fixed lg:sticky top-14 left-0 bottom-0
          w-[280px] lg:w-64
          h-[calc(100vh-3.5rem)]
          bg-sidebar border-r border-border
          z-50 lg:z-auto
          transform transition-transform duration-300 ease-out
          overflow-y-auto overscroll-contain
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {leftSidebar}
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 px-5 sm:px-8 lg:px-10 py-8 lg:py-12 min-w-0">
        {children}
      </main>

      {/* ── Right Sidebar — desktop only ── */}
      <aside className="hidden xl:block w-56 h-[calc(100vh-3.5rem)] overflow-y-auto overscroll-contain border-l border-border bg-sidebar px-5 py-8 sticky top-14 shrink-0">
        {rightSidebar}
      </aside>
    </div>
  );
}
