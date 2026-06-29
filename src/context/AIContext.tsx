'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

export interface AIInjection {
  summary?: string;
  tldr?: string;
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
  isProjectMode: boolean;
  setIsProjectMode: (mode: boolean) => void;
  completedProjectTopics: string[];
  markTopicComplete: (topicSlug: string) => void;
  projectCodebase: Record<string, string>;
  updateProjectCode: (filename: string, code: string) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [injections, setInjections] = useState<Record<string, AIInjection[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isProjectMode, setIsProjectMode] = useState(false);
  const [completedProjectTopics, setCompletedProjectTopics] = useState<string[]>([]);
  const [projectCodebase, setProjectCodebase] = useState<Record<string, string>>({});
  
  const topicsRef = useRef<string[]>([]);
  const codebaseRef = useRef<Record<string, string>>({});

  // Load injections and project state
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
        
      fetch(`${apiUrl}/api/ai/project/load/?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            const loadedTopics = data.completed_topics || [];
            const loadedCodebase = data.project_codebase || {};
            setCompletedProjectTopics(loadedTopics);
            setProjectCodebase(loadedCodebase);
            topicsRef.current = loadedTopics;
            codebaseRef.current = loadedCodebase;
          }
        })
        .catch(err => console.error("Failed to load project progress from backend", err));
    }
  }, [session]);

  const saveProjectToBackend = (topics: string[], codebase: Record<string, string>) => {
    if (session?.user) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://magnm-documentation.onrender.com';
      fetch(`${apiUrl}/api/ai/project/save/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          completed_topics: topics,
          project_codebase: codebase
        })
      }).catch(err => console.error("Failed to save project to backend", err));
    }
  };

  const markTopicComplete = (topicSlug: string) => {
    setCompletedProjectTopics(prev => {
      if (prev.includes(topicSlug)) return prev;
      const next = [...prev, topicSlug];
      topicsRef.current = next;
      saveProjectToBackend(next, codebaseRef.current);
      return next;
    });
  };

  const updateProjectCode = (filename: string, code: string) => {
    setProjectCodebase(prev => {
      const next = { ...prev, [filename]: code };
      codebaseRef.current = next;
      saveProjectToBackend(topicsRef.current, next);
      return next;
    });
  };

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
    <AIContext.Provider value={{ 
      isSearchOpen, setSearchOpen, injections, addInjection, undoInjection, clearInjections, isLoading, setIsLoading,
      isProjectMode, setIsProjectMode, completedProjectTopics, markTopicComplete, projectCodebase, updateProjectCode
    }}>
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
