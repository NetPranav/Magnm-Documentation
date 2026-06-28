'use client';

import React, { useState, useEffect } from 'react';
import { useAI } from '@/context/AIContext';
import { topicsData } from '@/data/topics';
import Editor from '@monaco-editor/react';
import TypewriterText from '@/components/TypewriterText';

export default function ProjectRunner() {
  const { completedProjectTopics, markTopicComplete, projectCodebase, updateProjectCode } = useAI();
  
  const [currentTopic, setCurrentTopic] = useState<any>(null);
  const [challengeInstructions, setChallengeInstructions] = useState<{theory: string, connection: string, code_example?: string, challenge: string} | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [code, setCode] = useState<string>('// Write your collaborative editor code here\n\n');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; text: string } | null>(null);
  const [isHinting, setIsHinting] = useState(false);
  const [hintText, setHintText] = useState<string>('');

  // Determine current topic based on progress
  useEffect(() => {
    const nextTopic = topicsData.find(t => !completedProjectTopics.includes(t.slug));
    if (nextTopic && (!currentTopic || currentTopic.slug !== nextTopic.slug)) {
      setCurrentTopic(nextTopic);
      setCurrentTopic(nextTopic);
      setChallengeInstructions(null);
      setFeedback(null);
      setHintText('');
      // Load previous code if they wrote some, or default
      setCode(projectCodebase['index.js'] || '// Write your collaborative editor code here\n\n');
    }
  }, [completedProjectTopics, currentTopic, projectCodebase]);

  // Fetch challenge instructions when topic changes
  useEffect(() => {
    if (currentTopic && !challengeInstructions && !isGenerating) {
      fetchChallenge(currentTopic);
    }
  }, [currentTopic]);

  const fetchChallenge = async (topic: any) => {
    setIsGenerating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://magnm-documentation.onrender.com';
      const res = await fetch(`${apiUrl}/api/ai/project/challenge/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic_slug: topic.slug,
          topic_title: topic.title, 
          topic_description: topic.description 
        }),
      });
      const data = await res.json();
      
      if (data.theory && data.challenge) {
        setChallengeInstructions(data);
      } else if (data.error) {
        console.error(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) setCode(value);
  };

  const handleSubmit = async () => {
    if (!currentTopic || !code.trim()) return;
    setIsEvaluating(true);
    setFeedback(null);
    
    // Auto-save code state locally to avoid losing it
    updateProjectCode('index.js', code);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://magnm-documentation.onrender.com';
      const res = await fetch(`${apiUrl}/api/ai/project/evaluate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic_slug: currentTopic.slug, 
          user_code: code 
        }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Evaluation failed');
      
      setFeedback({ success: data.success, text: data.feedback });
      
      if (data.success) {
        setTimeout(() => {
          markTopicComplete(currentTopic.slug);
        }, 3000); // Wait 3 seconds so they can read the success message before moving to next topic
      }
    } catch (err: any) {
      console.error(err);
      setFeedback({ success: false, text: `Evaluation Error: ${err.message}` });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleGetHint = async () => {
    if (!currentTopic || !code.trim()) return;
    setIsHinting(true);
    setHintText('');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://magnm-documentation.onrender.com';
      const res = await fetch(`${apiUrl}/api/ai/project/hint/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic_slug: currentTopic.slug, 
          user_code: code 
        }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to get hint');
      
      if (data.hint) {
        // Format the hint as a multi-line Javascript comment
        const commentHint = `/*\n * AI HINT:\n * ${data.hint.replace(/\n/g, '\n * ')}\n */\n\n`;
        setCode(prevCode => commentHint + prevCode);
      }
    } catch (err: any) {
      console.error(err);
      // Fallback hint in code if it fails
      setCode(prevCode => `// Failed to generate hint. Please try again.\n\n` + prevCode);
    } finally {
      setIsHinting(false);
    }
  };

  if (!currentTopic) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Congratulations!</h2>
        <p className="text-text-secondary">You have completed all 40 topics and built the entire Collaborative Text Editor!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full h-full min-h-[600px] overflow-hidden">
      
      {/* Left Panel: Instructions */}
      <div className="w-full lg:w-2/5 border-r border-border bg-background p-6 flex flex-col overflow-y-auto">
        <div className="flex items-center text-xs font-semibold text-primary mb-4 uppercase tracking-wider">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Current Objective: {currentTopic.title}
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {isGenerating ? (
            <div className="flex items-center text-text-muted animate-pulse">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              AI is preparing your challenge...
            </div>
          ) : challengeInstructions ? (
            <div className="space-y-6">
              {/* Theory Section */}
              <div>
                <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  Theory
                </h3>
                <div className="text-[13px] text-text-secondary leading-relaxed bg-background/50 border border-border rounded-lg p-3">
                  <TypewriterText text={challengeInstructions.theory} speed={10} />
                </div>
              </div>

              {/* Project Connection Section */}
              <div>
                <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Project Connection
                </h3>
                <div className="text-[13px] text-text-secondary leading-relaxed bg-background/50 border border-border rounded-lg p-3">
                  <TypewriterText text={challengeInstructions.connection} speed={10} delay={1000} />
                </div>
              </div>

              {/* Code Example Section */}
              {challengeInstructions.code_example && (
                <div>
                  <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    Code Example
                  </h3>
                  <div className="text-[13px] text-blue-300 font-mono leading-relaxed bg-[#1e1e1e] border border-border rounded-lg p-3 whitespace-pre-wrap">
                    <TypewriterText text={challengeInstructions.code_example} speed={10} delay={1500} />
                  </div>
                </div>
              )}

              {/* The Challenge Section */}
              <div>
                <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  Your Challenge
                </h3>
                <div className="text-[13.5px] font-medium text-foreground leading-relaxed bg-primary/5 border border-primary/20 rounded-lg p-4 shadow-inner">
                  <TypewriterText text={challengeInstructions.challenge} speed={15} delay={3000} />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {feedback && (
          <div className={`mt-6 p-4 rounded-lg border ${feedback.success ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'} animate-fade-in-up`}>
            <div className="font-bold mb-1 flex items-center">
              {feedback.success ? (
                <><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Success!</>
              ) : (
                <><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Not Quite Right</>
              )}
            </div>
            <p className="text-sm">{feedback.text}</p>
          </div>
        )}

      </div>

      {/* Right Panel: Monaco Editor */}
      <div className="w-full lg:w-3/5 flex flex-col bg-[#1e1e1e]">
        <div className="h-10 bg-[#2d2d2d] border-b border-black/50 flex items-center px-4">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-gray-400 font-mono">index.js - Collaborative Editor</span>
        </div>
        
        <div className="flex-1 relative">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              padding: { top: 16 }
            }}
          />
        </div>

        <div className="p-4 bg-[#2d2d2d] border-t border-black/50 flex justify-end space-x-3">
          <button
            onClick={handleGetHint}
            disabled={isEvaluating || isGenerating || isHinting || !code.trim()}
            className="px-4 py-2 bg-[#3d3d3d] hover:bg-[#4d4d4d] text-gray-200 text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isHinting ? (
              <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Thinking...</>
            ) : (
              <><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> Ask for a Hint</>
            )}
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isEvaluating || isGenerating || isHinting || !code.trim()}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEvaluating ? (
              <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Running Tests...</>
            ) : (
              <><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Submit Code</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
