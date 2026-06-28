'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

export interface AIInjection {
  summary?: string;
  inlineExplanations?: {
    paragraphIndex: number;
    text: string;
  }[];
  replacements?: {
    target: string;
    text: string;
    explanation?: string;
  }[];
  newSections?: {
    title: string;
    content: string;
  }[];
}

interface AIContextType {
  isSearchOpen: boolean;
  setSearchOpen: (isOpen: boolean) => void;
  injections: Record<string, AIInjection[]>; // Array of injections for history
  addInjection: (topicSlug: string, injection: AIInjection) => void;
  undoInjection: (topicSlug: string) => void;
  clearInjections: (topicSlug: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [injections, setInjections] = useState<Record<string, AIInjection[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load injections
  useEffect(() => {
    if (!session?.user) {
      const stored = localStorage.getItem('ai_injections');
      if (stored) {
        try {
          setInjections(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse stored injections", e);
        }
      }
    } else {
      // Fetch from Django backend when authenticated
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://magnm-documentation.onrender.com';
      fetch(`${apiUrl}/api/ai/load/?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setInjections(data);
          }
        })
        .catch(err => console.error("Failed to load injections from backend", err));
    }
  }, [session]);

  const saveInjectionsToBackend = (updatedInjections: Record<string, AIInjection[]>, topicSlug: string) => {
    if (!session?.user) {
      localStorage.setItem('ai_injections', JSON.stringify(updatedInjections));
    } else {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://magnm-documentation.onrender.com';
      fetch(`${apiUrl}/api/ai/save/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          topicSlug,
          history: updatedInjections[topicSlug] || []
        })
      }).catch(err => console.error("Failed to save injection to backend", err));
    }
  };

  const addInjection = (topicSlug: string, injection: AIInjection) => {
    setInjections((prev) => {
      const currentHistory = prev[topicSlug] || [];
      const updated = {
        ...prev,
        [topicSlug]: [...currentHistory, injection]
      };
      saveInjectionsToBackend(updated, topicSlug);
      return updated;
    });
  };

  const undoInjection = (topicSlug: string) => {
    setInjections((prev) => {
      const currentHistory = prev[topicSlug] || [];
      if (currentHistory.length === 0) return prev;
      
      const updated = {
        ...prev,
        [topicSlug]: currentHistory.slice(0, -1)
      };
      saveInjectionsToBackend(updated, topicSlug);
      return updated;
    });
  };

  const clearInjections = (topicSlug: string) => {
    setInjections((prev) => {
      const updated = {
        ...prev,
        [topicSlug]: []
      };
      saveInjectionsToBackend(updated, topicSlug);
      return updated;
    });
  };

  return (
    <AIContext.Provider value={{ isSearchOpen, setSearchOpen, injections, addInjection, undoInjection, clearInjections, isLoading, setIsLoading }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}
