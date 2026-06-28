'use client';

import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { topicsData } from "@/data/topics";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LeftSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex flex-col h-full w-full relative bg-sidebar">
      <div className="relative flex-1 min-h-0">
        <nav className="h-full flex flex-col space-y-0.5 px-5 py-8 overflow-y-auto overscroll-contain no-scrollbar pb-12">
        <h3 className="text-[11px] font-semibold text-text-muted mb-2 px-3 uppercase tracking-[0.15em]">
          Getting Started
        </h3>
        <Link
          href="/"
          className={`px-3 py-[7px] text-[13px] rounded-lg transition-all duration-200 ${
            pathname === "/"
              ? "bg-primary/10 text-primary-dark font-medium"
              : "text-text-secondary hover:bg-primary/5 hover:text-foreground"
          }`}
        >
          Overview
        </Link>

        {(() => {
          let currentSection = "";
          return topicsData.map((topic, idx) => {
            const isNewSection = topic.section !== currentSection;
            if (isNewSection) currentSection = topic.section;
            
            const isActive = pathname === `/${topic.slug}`;

            return (
              <React.Fragment key={topic.id}>
                {isNewSection && (
                  <h3 className="text-[11px] font-semibold text-text-muted mt-7 mb-2 px-3 uppercase tracking-[0.15em]">
                    {topic.section}
                  </h3>
                )}
                <Link
                  href={`/${topic.slug}`}
                  className={`px-3 py-[7px] text-[13px] rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary-dark font-medium"
                      : "text-text-secondary hover:bg-primary/5 hover:text-foreground"
                  }`}
                >
                  {topic.id}. {topic.shortTitle}
                </Link>
              </React.Fragment>
            );
          });
        })()}
        </nav>

        {/* Gradient Fade Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-sidebar to-transparent pointer-events-none z-10" />
      </div>

      {/* Auth Section at the bottom */}
      <div className="shrink-0 px-5 pb-6 pt-2 bg-sidebar relative z-20">
        {session && session.user ? (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-foreground truncate mr-2">
                {session.user.name || "User"}
              </span>
              <button 
                onClick={() => signOut()}
                className="text-xs text-text-muted hover:text-primary transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </div>
            <span className="text-[11px] text-text-muted truncate">
              {session.user.email}
            </span>
          </div>
        ) : (
          <button 
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center space-x-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors rounded-lg py-2 text-sm font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        )}
      </div>
    </div>
  );
}
