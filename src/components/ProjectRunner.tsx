'use client';

import React, { useState, useEffect } from 'react';
import { useAI } from '@/context/AIContext';
import { topicsData } from '@/data/topics';
import Editor from '@monaco-editor/react';
import TypewriterText from '@/components/TypewriterText';

export default function ProjectRunner() {
  const { completedProjectTopics, markTopicComplete, projectCodebase, updateProjectCode } = useAI();
  
  const [currentTopic, setCurrentTopic] = useState<any>(null);
  const [challengeInstructions, setChallengeInstructions] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [code, setCode] = useState<string>('// Write your collaborative editor code here\n\n');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; text: string } | null>(null);

  // Determine current topic based on progress
  useEffect(() => {
    const nextTopic = topicsData.find(t => !completedProjectTopics.includes(t.slug));
    if (nextTopic && (!currentTopic || currentTopic.slug !== nextTopic.slug)) {
      setCurrentTopic(nextTopic);
      setChallengeInstructions('');
      setFeedback(null);
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
      const prompt = `We are building a Collaborative Real-time Text Editor in Node.js. 
The current topic the user is learning is: ${topic.title}. 
First, briefly explain the core theory of this topic in 2-3 sentences. 
Second, explain exactly how this topic will be used in our Real-time Text Editor project.
Finally, give the user a specific, implementable coding challenge (1-2 sentences) to write in their editor right now to progress the project.`;

      const res = await fetch(`${apiUrl}/api/ai/generate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, topicContext: { title: topic.title, description: topic.description } }),
      });
      const data = await res.json();
      
      // Since GenerateAIView returns our specific schema, we look at the summary
      if (data.summary) {
        setChallengeInstructions(data.summary);
      } else if (data.error) {
        setChallengeInstructions(`Error generating challenge: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setChallengeInstructions("Failed to load instructions. The AI API might be busy.");
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
        
        <div className="prose prose-sm dark:prose-invert flex-1">
          {isGenerating ? (
            <div className="flex items-center text-text-muted animate-pulse">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              AI is preparing your challenge...
            </div>
          ) : (
            <TypewriterText text={challengeInstructions} />
          )}
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

        <div className="p-4 bg-[#2d2d2d] border-t border-black/50 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isEvaluating || isGenerating || !code.trim()}
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
