'use client';

import React, { useState, useEffect, useRef } from 'react';

// ── Token Types ──
type TokenType = 'keyword' | 'string' | 'comment' | 'number' | 'method' | 'property' | 'arrow' | 'punctuation' | 'operator' | 'identifier' | 'whitespace' | 'plain';

interface Token {
  type: TokenType;
  value: string;
}

// ── VS Code Light Theme Colors (warm palette) ──
const tokenColors: Record<TokenType, string> = {
  keyword:     '#8B5CF6',  // violet
  string:      '#A16207',  // warm amber
  comment:     '#94A3B8',  // slate gray
  number:      '#059669',  // emerald
  method:      '#C2410C',  // rust/orange for method calls
  property:    '#6B8FA0',  // dusty blue
  arrow:       '#8B5CF6',  // purple like keywords
  punctuation: '#64748B',  // slate
  operator:    '#64748B',  // slate
  identifier:  '#374151',  // dark gray
  whitespace:  'inherit',
  plain:       'inherit',
};

// ── Expanded Hover Dictionary ──
const hoverDict: Record<string, { label: string; desc: string }> = {
  // Keywords
  'const':    { label: 'const',           desc: 'Declares a block-scoped, read-only named constant.' },
  'let':      { label: 'let',             desc: 'Declares a block-scoped local variable, optionally initializing it to a value.' },
  'var':      { label: 'var',             desc: 'An older way to declare variables. Function-scoped, not block-scoped. Mostly avoided.' },
  'function': { label: 'function',        desc: 'Declares a reusable block of code that can be called by name.' },
  'require':  { label: 'require(path)',   desc: 'Imports a module using CommonJS. Returns the exported object from the specified module or package.' },
  'import':   { label: 'import',          desc: 'ES Module syntax to bring in named or default exports from other files.' },
  'export':   { label: 'export',          desc: 'Makes variables, functions, or classes available for other files to import.' },
  'await':    { label: 'await',           desc: 'Pauses execution inside an async function until the given Promise resolves.' },
  'try':      { label: 'try { }',         desc: 'Wraps code that might throw an error. Always paired with catch and/or finally.' },
  'catch':    { label: 'catch(error)',     desc: 'Runs when an error is thrown inside the try block. Receives the error object.' },
  'return':   { label: 'return',          desc: 'Exits a function and optionally sends a value back to the caller.' },
  'new':      { label: 'new Constructor()',desc: 'Creates a new instance of a class or constructor function.' },
  'this':     { label: 'this',            desc: 'Refers to the current object context. Its value depends on how the function was called.' },

  // Identifiers
  'spawn':      { label: 'spawn(cmd, args)',         desc: 'Creates a new child process using the given command. Returns a ChildProcess with stdin, stdout, and stderr streams.' },
  'console':    { label: 'console',                  desc: 'Global object for terminal output. Provides .log(), .error(), .warn(), .table() and more.' },
  'gitProcess': { label: 'gitProcess (ChildProcess)', desc: 'A ChildProcess instance returned by spawn(). Has .stdout, .stderr streams and emits events like "data" and "close".' },
  'setTimeout': { label: 'setTimeout(callback, ms)',  desc: 'Schedules a callback to run after a minimum delay in milliseconds. The callback is placed in the Timers phase of the Event Loop.' },
  'setImmediate': { label: 'setImmediate(callback)',   desc: 'Schedules a callback to execute in the Check phase of the Event Loop, immediately after I/O callbacks.' },
  'process':    { label: 'process',                  desc: 'A global object providing information and control over the current Node.js process.' },
  'Buffer':     { label: 'Buffer',                   desc: 'A global class for manipulating binary data directly in memory.' },
  'activeSyncSessions': { label: 'activeSyncSessions', desc: 'Our hypothetical global array. Global arrays are a common source of memory leaks if references are not explicitly removed.' },
  'Promise':    { label: 'Promise',                  desc: 'An object representing the eventual completion (or failure) of an asynchronous operation.' },

  // Arrow operator
  '=>': { label: '=> Arrow Function', desc: 'A concise way to write functions. Unlike regular functions, arrow functions inherit "this" from their surrounding scope.' },

  // Methods (with dot prefix)
  '.on':     { label: '.on(event, callback)',   desc: 'Registers an event listener. The callback fires each time the named event is emitted on this object.' },
  '.exit':   { label: 'process.exit(code)',     desc: 'Instantly terminates the Node.js process. Code 0 means success, 1 means failure.' },
  '.alloc':  { label: 'Buffer.alloc(size)',     desc: 'Allocates a new Buffer of the specified size in memory.' },
  '.all':    { label: 'Promise.all(iterable)',  desc: 'Takes an array of Promises and returns a single Promise that resolves when ALL of them have resolved (or rejects if ANY fail). Perfect for parallel execution.' },
  '.stdout': { label: '.stdout (Readable Stream)', desc: 'Standard output stream of a child process. Data the child process writes to stdout appears here as readable chunks.' },
  '.log':    { label: 'console.log()',          desc: 'Prints arguments to the terminal, separated by spaces, with a newline at the end.' },
  '.error':  { label: 'console.error()',        desc: 'Prints error messages to the terminal (stderr stream).' },
  '.pipe':   { label: '.pipe(destination)',     desc: 'Connects a readable stream to a writable stream. Data flows automatically from source to destination.' },
  '.listen': { label: '.listen(port)',          desc: 'Starts a server listening for connections on the given port number.' },
  '.watch':  { label: 'fs.watch(path, callback)', desc: 'Watches a file or directory for changes. The callback receives the event type and the filename.' },
  '.nextTick': { label: 'process.nextTick(callback)', desc: 'Places the callback at the absolute front of the microtask queue. It will run before the Event Loop continues to the next phase.' },

  // Strings (module names & event names)
  "'child_process'": { label: "'child_process' module", desc: 'Built-in Node.js module for creating child processes. Provides spawn(), exec(), fork(), and execFile().' },
  "'fs'":            { label: "'fs' module",             desc: 'Built-in File System module. Used to read, write, and watch files and directories on the local machine.' },
  "'data'":          { label: "'data' event",            desc: 'Emitted when a readable stream has a chunk of data available. The callback receives a Buffer or string.' },
  "'close'":         { label: "'close' event",           desc: "Emitted when a process's stdio streams close. The callback receives the exit code (0 = success)." },
  "'git'":           { label: "'git' command",           desc: "The Git version control CLI. spawn('git', ['status']) runs \"git status\" as a child process." },
  "'status'":        { label: "'status' argument",       desc: 'Passed as an argument to the git command. "git status" shows the current state of the working directory.' },
};

// ── Tokenizer ──
function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  // Master regex — order matters: first match wins
  const regex = /\/\/[^\n]*|`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|\b(?:const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|class|extends|super|import|export|from|default|as|async|await|try|catch|finally|throw|typeof|instanceof|in|of|null|undefined|true|false|yield)\b|\b\d+(?:\.\d+)?\b|\.\w+(?=\s*\()|\.\w+|=>|[{}()\[\];,]|[=+\-*/<>!&|?:]+|\b[\w$]+\b|\s+|./gm;

  let match;
  while ((match = regex.exec(code)) !== null) {
    const v = match[0];
    let type: TokenType;

    if (v.startsWith('//'))                                                type = 'comment';
    else if (/^['"`]/.test(v))                                             type = 'string';
    else if (/^(?:const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|class|extends|super|import|export|from|default|as|async|await|try|catch|finally|throw|typeof|instanceof|in|of|null|undefined|true|false|yield)$/.test(v))
                                                                           type = 'keyword';
    else if (/^\d/.test(v))                                                type = 'number';
    else if (v.startsWith('.') && /^\s*\(/.test(code.slice(match.index + v.length)))
                                                                           type = 'method';
    else if (v.startsWith('.'))                                             type = 'property';
    else if (v === '=>')                                                    type = 'arrow';
    else if (/^[{}()\[\];,]$/.test(v))                                     type = 'punctuation';
    else if (/^[=+\-*/<>!&|?:]+$/.test(v))                                type = 'operator';
    else if (/^\s+$/.test(v))                                               type = 'whitespace';
    else if (/^[\w$]+$/.test(v))                                            type = 'identifier';
    else                                                                    type = 'plain';

    tokens.push({ type, value: v });
  }
  return tokens;
}

// ── Component ──
export default function SyntaxHoverCode({ code }: { code: string }) {
  const tokens = tokenize(code);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close tooltips on outside click (for mobile)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveIndex(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative my-3" ref={containerRef}>
      <pre
        className="bg-white text-[12px] sm:text-[13px] p-3 sm:p-5 rounded-xl border border-[#E8E2D9] font-mono leading-[1.85] whitespace-pre-wrap overflow-visible"
      >
        <code>
          {tokens.map((token, i) => {
            if (token.type === 'whitespace') {
              return <span key={i}>{token.value}</span>;
            }

            const color = tokenColors[token.type];
            const isComment = token.type === 'comment';

            // Look up hover info by token value
            const hoverInfo = hoverDict[token.value];

            if (hoverInfo) {
              const isActive = activeIndex === i;

              return (
                <span
                  key={i}
                  className="group/tip relative inline"
                  style={{ color, fontStyle: isComment ? 'italic' : undefined, cursor: 'pointer' }}
                  onClick={(e) => {
                    // Toggle tooltip on tap
                    e.stopPropagation();
                    setActiveIndex(isActive ? null : i);
                  }}
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') setActiveIndex(i);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === 'mouse') setActiveIndex(null);
                  }}
                >
                  <span className="border-b border-dotted border-current/40">
                    {token.value}
                  </span>
                  {/* Tooltip — below, left-aligned, never clipped */}
                  <span
                    className={`pointer-events-none absolute top-full left-0 mt-2 w-56 sm:w-[272px] transition-all duration-150 z-[100] ${
                      isActive 
                        ? 'opacity-100 translate-y-0 lg:group-hover/tip:opacity-100 lg:group-hover/tip:translate-y-0' 
                        : 'opacity-0 translate-y-1 lg:group-hover/tip:opacity-100 lg:group-hover/tip:translate-y-0'
                    }`}
                  >
                    {/* Added whitespace-normal to prevent tooltip text from inheriting whitespace-pre and overflowing */}
                    <span className="block bg-white border border-[#E8E2D9] rounded-lg p-3.5 shadow-xl text-left font-sans relative whitespace-normal">
                      {/* Arrow */}
                      <span className="absolute bottom-full left-3 border-[6px] border-transparent border-b-[#E8E2D9]"></span>
                      <span className="absolute bottom-full left-3 border-[5px] border-transparent border-b-white ml-[1px] -mb-[1px]"></span>
                      <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B8FA0] mb-1.5 font-mono">{hoverInfo.label}</span>
                      <span className="block text-[12px] leading-[1.6] text-[#2D2D2D] font-normal">{hoverInfo.desc}</span>
                    </span>
                  </span>
                </span>
              );
            }

            // No hover — just colored token
            return (
              <span key={i} style={{ color, fontStyle: isComment ? 'italic' : undefined }}>
                {token.value}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
