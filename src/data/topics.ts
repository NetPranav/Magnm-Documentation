export interface TopicData {
  id: number | string;
  slug: string;
  title: string;
  shortTitle: string;
  section: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  miniProject?: {
    title: string;
    description: React.ReactNode;
    code?: string;
  };
  description?: string;
  paragraphs?: React.ReactNode[];
  basicExample?: string;
  advancedExample?: string;
  advancedTitle?: string;
  advancedParagraphs?: React.ReactNode[];
  imageUrl?: string;
  imageAlt?: string;
  extraExamples?: {
    title: string;
    paragraphs: React.ReactNode[];
    code: string;
  }[];
  quiz?: {
    title?: string;
    questions: {
      question: string;
      options: string[];
      correctAnswerIndex: number;
      explanation: string;
    }[];
  };
}

import { topic0aContent } from './content/topic0a';
import { topic0bContent } from './content/topic0b';
import { topic0cContent } from './content/topic0c';
import { topic0dContent } from './content/topic0d';
import { topic1Content } from './content/topic1';
import { topic2Content } from './content/topic2';
import { topic3Content } from './content/topic3';
import { topic4Content } from './content/topic4';
import { topic5Content } from './content/topic5';
import { topic6Content } from './content/topic6';
import { topic7Content } from './content/topic7';
import { topic8Content } from './content/topic8';
import { topic9Content } from './content/topic9';
import { topic10Content } from './content/topic10';
import { topic11Content } from './content/topic11';
import { topic12Content } from './content/topic12';
import { topic13Content } from './content/topic13';
import { topic14Content } from './content/topic14';
import { topic15Content } from './content/topic15';
import { topic16Content } from './content/topic16';
import { topic17Content } from './content/topic17';
import { topic18Content } from './content/topic18';
import { topic19Content } from './content/topic19';
import { topic20Content } from './content/topic20';
import { topic21Content } from './content/topic21';
import { topic22Content } from './content/topic22';
import { topic23Content } from './content/topic23';
import { topic24Content } from './content/topic24';
import { topic25Content } from './content/topic25';
import { topic26Content } from './content/topic26';
import { topic27Content } from './content/topic27';
import { topic28Content } from './content/topic28';
import { topic29Content } from './content/topic29';
import { topic30Content } from './content/topic30';
import { topic31Content } from './content/topic31';
import { topic32Content } from './content/topic32';
import { topic33Content } from './content/topic33';
import { topic34Content } from './content/topic34';
import { topic35Content } from './content/topic35';
import { topic36Content } from './content/topic36';
import { topic37Content } from './content/topic37';
import { topic38Content } from './content/topic38';
import { topic39Content } from './content/topic39';
import { topic40Content } from './content/topic40';

export const topicsData: TopicData[] = [
  {
    "id": "0a",
    "slug": "0a-what-is-package-json",
    "title": "What is package.json?",
    "shortTitle": "package.json & npm",
    "section": "The Absolute Basics",
    ...topic0aContent
  },
  {
    "id": "0b",
    "slug": "0b-commonjs-vs-es-modules",
    "title": "CommonJS vs ES Modules",
    "shortTitle": "CJS vs ESM",
    "section": "The Absolute Basics",
    ...topic0bContent
  },
  {
    "id": "0c",
    "slug": "0c-running-scripts",
    "title": "Running Node.js Scripts",
    "shortTitle": "Running Scripts",
    "section": "The Absolute Basics",
    ...topic0cContent
  },
  {
    "id": "0d",
    "slug": "0d-basic-http-server",
    "title": "Building a Basic HTTP Server",
    "shortTitle": "Basic HTTP Server",
    "section": "The Absolute Basics",
    ...topic0dContent
  },
  {
    "id": 1,
    "slug": "1-what-is-node-js-really",
    "title": "What is Node.js really? (The V8 Engine & Libuv)",
    "shortTitle": "What is Node.js really?",
    "section": "Core Execution & Event Loop",
    "difficulty": "Beginner",
    ...topic1Content
  },
  {
    "id": 2,
    "slug": "2-the-event-loop-explained",
    "title": "The Event Loop Explained (Phases and Timers)",
    "shortTitle": "The Event Loop Explained",
    "section": "Core Execution & Event Loop",
    "difficulty": "Advanced",
    ...topic2Content
  },
  {
    "id": 3,
    "slug": "3-process-nexttick",
    "title": "process.nextTick() vs setImmediate()",
    "shortTitle": "process.nextTick",
    "section": "Core Execution & Event Loop",
    "difficulty": "Intermediate",
    ...topic3Content
  },
  {
    "id": 4,
    "slug": "4-memory-management-garbage-collection",
    "title": "Memory Management & Garbage Collection",
    "shortTitle": "Memory Management & Garbage Collection",
    "section": "Core Execution & Event Loop",
    "difficulty": "Intermediate",
    ...topic4Content
  },
  {
    "id": 5,
    "slug": "5-the-process-object",
    "title": "The process Object (Env vars, argv, exit codes)",
    "shortTitle": "The process Object",
    "section": "Core Execution & Event Loop",
    "difficulty": "Beginner",
    ...topic5Content
  },
  {
    "id": 6,
    "slug": "6-asynchronous-patterns",
    "title": "Asynchronous Patterns (Promises & Async/Await deep dive)",
    "shortTitle": "Asynchronous Patterns",
    "section": "Core Execution & Event Loop",
    "difficulty": "Intermediate",
    ...topic6Content
  },
  {
    "id": 7,
    "slug": "7-the-path-module",
    "title": "The path module (Cross-platform path resolution)",
    "shortTitle": "The path module",
    "section": "File System Mastery",
    "difficulty": "Beginner",
    ...topic7Content
  },
  {
    "id": 8,
    "slug": "8-fs-readfilesync-vs-fs-readfile",
    "title": "fs.readFileSync vs fs.readFile (When to block)",
    "shortTitle": "fs.readFileSync vs fs.readFile",
    "section": "File System Mastery",
    "difficulty": "Beginner",
    ...topic8Content
  },
  {
    "id": 9,
    "slug": "9-the-fs-promises-api",
    "title": "The fs/promises API",
    "shortTitle": "The fs/promises API",
    "section": "File System Mastery",
    "difficulty": "Intermediate",
    ...topic9Content
  },
  {
    "id": 10,
    "slug": "10-watching-files-and-directories-for-changes",
    "title": "Watching files and directories for changes",
    "shortTitle": "Watching files",
    "section": "File System Mastery",
    "difficulty": "Intermediate",
    ...topic10Content
  },
  {
    "id": 11,
    "slug": "11-reading-massive-files-without-crashing",
    "title": "Reading massive files without crashing",
    "shortTitle": "Reading massive files",
    "section": "File System Mastery",
    "difficulty": "Advanced",
    ...topic11Content
  },
  {
    "id": 12,
    "slug": "12-walking-directories-recursively",
    "title": "Walking directories recursively",
    "shortTitle": "Walking directories",
    "section": "File System Mastery",
    "difficulty": "Intermediate",
    ...topic12Content
  },
  {
    "id": 13,
    "slug": "13-what-is-a-buffer",
    "title": "What is a Buffer? (Handling binary data)",
    "shortTitle": "What is a Buffer?",
    "section": "Data Handling",
    "difficulty": "Beginner",
    ...topic13Content
  },
  {
    "id": 14,
    "slug": "14-encoding-and-decoding-strings",
    "title": "Encoding and Decoding strings",
    "shortTitle": "Encoding and Decoding strings",
    "section": "Data Handling",
    "difficulty": "Beginner",
    ...topic14Content
  },
  {
    "id": 15,
    "slug": "15-readable-streams",
    "title": "Readable Streams",
    "shortTitle": "Readable Streams",
    "section": "Data Handling",
    "difficulty": "Advanced",
    ...topic15Content
  },
  {
    "id": 16,
    "slug": "16-writable-streams",
    "title": "Writable Streams",
    "shortTitle": "Writable Streams",
    "section": "Data Handling",
    "difficulty": "Intermediate",
    ...topic16Content
  },
  {
    "id": 17,
    "slug": "17-transform-duplex-streams",
    "title": "Transform & Duplex Streams",
    "shortTitle": "Transform & Duplex Streams",
    "section": "Data Handling",
    "difficulty": "Advanced",
    ...topic17Content
  },
  {
    "id": 18,
    "slug": "18-piping-streams-together",
    "title": "Piping streams together",
    "shortTitle": "Piping streams together",
    "section": "Data Handling",
    "difficulty": "Intermediate",
    ...topic18Content
  },
  {
    "id": 19,
    "slug": "19-child-process-exec",
    "title": "child_process.exec",
    "shortTitle": "child_process.exec",
    "section": "Process Management",
    "difficulty": "Beginner",
    ...topic19Content
  },
  {
    "id": 20,
    "slug": "20-child-process-spawn",
    "title": "child_process.spawn",
    "shortTitle": "child_process.spawn",
    "section": "Process Management",
    "difficulty": "Intermediate",
    ...topic20Content
  },
  {
    "id": 21,
    "slug": "21-inter-process-communication",
    "title": "Inter-process communication",
    "shortTitle": "Inter-process communication",
    "section": "Process Management",
    "difficulty": "Advanced",
    ...topic21Content
  },
  {
    "id": 22,
    "slug": "22-the-worker-threads-module",
    "title": "The worker_threads module",
    "shortTitle": "The worker_threads module",
    "section": "Process Management",
    "difficulty": "Advanced",
    ...topic22Content
  },
  {
    "id": 23,
    "slug": "23-sharing-memory-between-threads",
    "title": "Sharing memory between threads",
    "shortTitle": "Sharing memory between threads",
    "section": "Process Management",
    "difficulty": "Advanced",
    ...topic23Content
  },
  {
    "id": 24,
    "slug": "24-handling-process-crashes-gracefully",
    "title": "Handling process crashes gracefully",
    "shortTitle": "Handling process crashes",
    "section": "Process Management",
    "difficulty": "Intermediate",
    ...topic24Content
  },
  {
    "id": 25,
    "slug": "25-the-net-module",
    "title": "The net module (TCP Sockets)",
    "shortTitle": "The net module",
    "section": "Networking & Real-Time"
  },
  {
    "id": 26,
    "slug": "26-creating-a-basic-tcp-server",
    "title": "Creating a basic TCP Server",
    "shortTitle": "Creating a basic TCP Server",
    "section": "Networking & Real-Time"
  },
  {
    "id": 27,
    "slug": "27-the-http-module-under-the-hood",
    "title": "The http module under the hood",
    "shortTitle": "The http module under the hood",
    "section": "Networking & Real-Time"
  },
  {
    "id": 28,
    "slug": "28-introduction-to-websockets",
    "title": "Introduction to WebSockets",
    "shortTitle": "Introduction to WebSockets",
    "section": "Networking & Real-Time"
  },
  {
    "id": 29,
    "slug": "29-building-a-local-websocket-server",
    "title": "Building a local WebSocket server",
    "shortTitle": "Building a local WebSocket server",
    "section": "Networking & Real-Time"
  },
  {
    "id": 30,
    "slug": "30-connecting-to-external-apis",
    "title": "Connecting to external APIs (The native fetch API)",
    "shortTitle": "Connecting to external APIs",
    "section": "Networking & Real-Time"
  },
  {
    "id": 31,
    "slug": "31-what-is-webrtc",
    "title": "What is WebRTC?",
    "shortTitle": "What is WebRTC?",
    "section": "WebRTC & Architecture",
    ...topic31Content
  },
  {
    "id": 32,
    "slug": "32-the-signaling-phase",
    "title": "The Signaling Phase",
    "shortTitle": "The Signaling Phase",
    "section": "WebRTC & Architecture",
    ...topic32Content
  },
  {
    "id": 33,
    "slug": "33-ice-candidates-stun-and-turn-servers",
    "title": "ICE Candidates, STUN and TURN servers",
    "shortTitle": "ICE Candidates, STUN and TURN",
    "section": "WebRTC & Architecture",
    ...topic33Content
  },
  {
    "id": 34,
    "slug": "34-setting-up-a-data-channel-for-p2p-messaging",
    "title": "Setting up a Data Channel for P2P messaging",
    "shortTitle": "Data Channel for P2P messaging",
    "section": "WebRTC & Architecture",
    ...topic34Content
  },
  {
    "id": 35,
    "slug": "35-establishing-a-webrtc-connection-in-node-js",
    "title": "Establishing a WebRTC connection in Node.js",
    "shortTitle": "WebRTC connection in Node.js",
    "section": "WebRTC & Architecture",
    ...topic35Content
  },
  {
    "id": 36,
    "slug": "36-broadcasting-state-changes-in-real-time",
    "title": "Broadcasting state changes in real-time",
    "shortTitle": "Broadcasting state changes",
    "section": "WebRTC & Architecture",
    ...topic36Content
  },
  {
    "id": 37,
    "slug": "37-event-emitters",
    "title": "Event Emitters (Custom pub/sub patterns)",
    "shortTitle": "Event Emitters",
    "section": "WebRTC & Architecture",
    ...topic37Content
  },
  {
    "id": 38,
    "slug": "38-profiling-node-js-memory-leaks",
    "title": "Profiling Node.js memory leaks",
    "shortTitle": "Profiling Node.js memory leaks",
    "section": "WebRTC & Architecture",
    ...topic38Content
  },
  {
    "id": 39,
    "slug": "39-hooking-into-the-runtime",
    "title": "Hooking into the runtime (async_hooks)",
    "shortTitle": "Hooking into the runtime",
    "section": "WebRTC & Architecture",
    ...topic39Content
  },
  {
    "id": 40,
    "slug": "40-bundling-node-js-code",
    "title": "Bundling Node.js code (Deployment)",
    "shortTitle": "Bundling Node.js code",
    "section": "WebRTC & Architecture",
    ...topic40Content
  }
];
