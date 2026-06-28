'use client';

import React, { useState, useEffect } from 'react';

export default function TypewriterText({ text, className = '' }: { text: string; className?: string }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    
    // Split text into words (preserving spaces)
    const words = text.split(/(\s+)/);
    let currentWordIndex = 0;
    
    const interval = setInterval(() => {
      if (currentWordIndex < words.length) {
        setDisplayedText((prev) => prev + words[currentWordIndex]);
        currentWordIndex++;
      } else {
        clearInterval(interval);
      }
    }, 40); // 40ms per word/space gives a nice fast typing effect
    
    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayedText}</span>;
}
