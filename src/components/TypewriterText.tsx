'use client';

import React, { useState, useEffect } from 'react';

export default function TypewriterText({ 
  text, 
  className = '',
  speed = 40,
  delay = 0
}: { 
  text: string; 
  className?: string;
  speed?: number;
  delay?: number;
}) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    
    // Split text into words and manually re-attach spaces to avoid regex capturing group bugs in some browsers
    const words = text.split(' ').map((word, i, arr) => word + (i < arr.length - 1 ? ' ' : ''));
    let currentWordIndex = 0;
    let interval: NodeJS.Timeout;
    
    const startTyping = () => {
      interval = setInterval(() => {
        if (currentWordIndex < words.length) {
          setDisplayedText((prev) => prev + words[currentWordIndex]);
          currentWordIndex++;
        } else {
          clearInterval(interval);
        }
      }, speed);
    };

    const timeout = setTimeout(startTyping, delay);
    
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, delay]);

  return <span className={className}>{displayedText}</span>;
}
