'use client';

import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { topicsData } from "@/data/topics";

export default function RightSidebar() {
  const pathname = usePathname();

  // Find the current topic based on pathname
  const isHomepage = pathname === '/';
  const topic = topicsData.find(t => '/' + t.slug === pathname);
  
  // Calculate reading time safely (avoiding JSON.stringify on React elements)
  let readingTime = "3 min read";
  if (topic) {
    let charCount = 0;
    if (topic.title) charCount += topic.title.length;
    if (topic.description) charCount += topic.description.length;
    if (topic.paragraphs) charCount += topic.paragraphs.length * 300; // estimate 300 chars per paragraph
    if (topic.basicExample) charCount += topic.basicExample.length;
    if (topic.advancedExample) charCount += topic.advancedExample.length;
    if (topic.extraExamples) charCount += topic.extraExamples.length * 500;
    
    // Roughly 1000 characters per minute of reading code/technical docs
    const mins = Math.max(1, Math.ceil(charCount / 1000));
    readingTime = `${mins} min read`;
  }

  // Dynamic Table of Contents
  const tocLinks = [];
  if (isHomepage) {
    tocLinks.push(
      { name: "Overview", href: "#overview" },
      { name: "Interactive Example", href: "#interactive-example" },
      { name: "The 40-Topic Path", href: "#topics" }
    );
  } else if (topic) {
    tocLinks.push({ name: "Overview", href: "#overview" });
    
    if (topic.imageUrl) {
      tocLinks.push({ name: "Architecture Diagram", href: "#architecture" });
    }
    
    tocLinks.push({ name: "Content", href: "#content" });
    tocLinks.push({ name: "Basic Example", href: "#basic-example" });
    tocLinks.push({ name: topic.advancedTitle || "Real-World Example", href: "#real-world-example" });
    
    if (topic.extraExamples) {
      topic.extraExamples.forEach((ex, idx) => {
        tocLinks.push({ name: ex.title, href: `#extra-example-${idx}` });
      });
    }
    
    if (topic.miniProject) {
      tocLinks.push({ name: "Module Capstone", href: "#capstone" });
    }
    
    if (topic.quiz) {
      tocLinks.push({ name: "Module Quiz", href: "#quiz" });
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Reading Time */}
      {!isHomepage && (
        <div className="mb-8 flex items-center text-xs font-medium text-text-muted bg-primary/5 px-3 py-1.5 rounded-lg w-fit border border-primary/10">
          <svg className="w-3.5 h-3.5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {readingTime}
        </div>
      )}

      {/* Table of Contents */}
      <h4 className="text-[11px] font-semibold text-text-muted mb-4 uppercase tracking-[0.15em]">
        On this page
      </h4>
      <nav className="flex flex-col space-y-1 mb-10">
        {tocLinks.map((link, idx) => (
          <Link
            key={idx}
            href={link.href}
            className="text-[13px] px-3 py-[6px] rounded-lg transition-all duration-200 text-text-muted hover:text-foreground hover:bg-primary/5"
          >
            {link.name}
          </Link>
        ))}
      </nav>
      
      {/* Community Links */}
      <h4 className="text-[11px] font-semibold text-text-muted mb-4 uppercase tracking-[0.15em]">
        Community
      </h4>
      <div className="flex flex-col space-y-2 mb-10">
        <a href="https://discord.gg/rjSyBNCcSP" target="_blank" rel="noopener noreferrer" className="flex items-center text-[13px] text-text-secondary hover:text-foreground transition-colors group">
          <svg className="w-4 h-4 mr-3 opacity-60 group-hover:opacity-100 group-hover:text-[#5865F2] transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
          </svg>
          Join Discord
        </a>
        <a href="#" className="flex items-center text-[13px] text-text-secondary hover:text-foreground transition-colors group">
          <svg className="w-4 h-4 mr-3 opacity-60 group-hover:opacity-100 group-hover:text-[#1DA1F2] transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          Follow on X
        </a>
        <a href="https://github.com/NetPranav/Magnm-Documentation" target="_blank" rel="noopener noreferrer" className="flex items-center text-[13px] text-text-secondary hover:text-foreground transition-colors group">
          <svg className="w-4 h-4 mr-3 opacity-60 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          Star on GitHub
        </a>
      </div>
      
      {/* Edit this page */}
      <div className="mt-auto pt-8 border-t border-border">
        <Link href="https://github.com/NetPranav/Magnm-Documentation" target="_blank" rel="noopener noreferrer" className="flex items-center text-[12px] text-text-muted hover:text-foreground transition-colors group">
          <svg className="w-3.5 h-3.5 mr-2 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit this page on GitHub
        </Link>
      </div>
    </div>
  );
}
