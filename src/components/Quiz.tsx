'use client';

import React, { useState } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface QuizProps {
  title?: string;
  questions: QuizQuestion[];
}

export default function Quiz({ title = "Knowledge Check", questions }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedOptionIndex === currentQuestion.correctAnswerIndex;

  const handleSubmit = () => {
    if (selectedOptionIndex === null) return;
    
    setHasSubmitted(true);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionIndex(null);
      setHasSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setHasSubmitted(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="mt-12 border border-border rounded-xl p-8 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
        <h3 className="text-2xl font-serif font-bold text-foreground mb-4">Quiz Completed!</h3>
        <p className="text-text-secondary mb-6 text-lg">
          You scored <span className="font-bold text-foreground">{score} out of {questions.length}</span> ({percentage}%)
        </p>
        
        {percentage === 100 ? (
          <p className="text-emerald-500 mb-8 font-medium">Perfect score! You truly understand this module.</p>
        ) : percentage >= 70 ? (
          <p className="text-blue-500 mb-8 font-medium">Great job! You have a solid grasp of the concepts.</p>
        ) : (
          <p className="text-text-muted mb-8 font-medium">A good start, but you might want to review the material again.</p>
        )}
        
        <button 
          onClick={handleRestart}
          className="px-6 py-2 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="mt-12 border border-border rounded-xl bg-background overflow-hidden">
      {/* Header */}
      <div className="bg-black/[0.02] border-b border-border px-6 py-4 flex justify-between items-center">
        <h3 className="font-serif font-semibold text-foreground text-lg flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {title}
        </h3>
        <span className="text-xs font-medium text-text-muted bg-border/50 px-2.5 py-1 rounded-full">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Question Body */}
      <div className="p-6 sm:p-8">
        <h4 className="text-lg text-foreground font-medium mb-6">
          {currentQuestion.question}
        </h4>

        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, index) => {
            let itemClass = "border-border bg-background hover:border-primary/30 hover:bg-primary/5 text-text-secondary";
            
            if (hasSubmitted) {
              if (index === currentQuestion.correctAnswerIndex) {
                itemClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 font-medium";
              } else if (index === selectedOptionIndex && !isCorrect) {
                itemClass = "border-red-500/50 bg-red-500/10 text-red-700";
              } else {
                itemClass = "border-border bg-background opacity-50 text-text-muted";
              }
            } else if (selectedOptionIndex === index) {
              itemClass = "border-primary bg-primary/10 text-primary-dark font-medium";
            }

            return (
              <button
                key={index}
                disabled={hasSubmitted}
                onClick={() => setSelectedOptionIndex(index)}
                className={`w-full text-left px-5 py-4 rounded-lg border transition-all duration-200 ${itemClass}`}
              >
                <div className="flex items-start">
                  <div className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mr-3 mt-0.5 ${hasSubmitted && index === currentQuestion.correctAnswerIndex ? 'border-emerald-500 bg-emerald-500 text-white' : hasSubmitted && index === selectedOptionIndex && !isCorrect ? 'border-red-500 bg-red-500 text-white' : selectedOptionIndex === index ? 'border-primary bg-primary' : 'border-border'}`}>
                    {(hasSubmitted && index === currentQuestion.correctAnswerIndex) && (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    )}
                    {(hasSubmitted && index === selectedOptionIndex && !isCorrect) && (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation Box */}
        {hasSubmitted && (
          <div className={`p-5 rounded-lg mb-6 border ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
            <p className="font-medium text-foreground mb-1">
              {isCorrect ? '✨ Correct!' : '❌ Incorrect'}
            </p>
            <p className="text-text-secondary text-sm">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end">
          {!hasSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOptionIndex === null}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${selectedOptionIndex !== null ? 'bg-foreground text-background hover:bg-foreground/90' : 'bg-border text-text-muted cursor-not-allowed'}`}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary-dark text-white font-medium rounded-lg hover:bg-primary-dark/90 transition-all duration-200"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
