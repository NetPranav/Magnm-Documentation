'use client';

import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { topicsData } from "@/data/topics";

export default function LeftSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-0.5 px-5 py-8">
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
  );
}
