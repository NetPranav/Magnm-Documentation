export interface TopicData {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  section: string;
  description?: string;
  paragraphs?: React.ReactNode[];
  basicExample?: string;
  advancedExample?: string;
  advancedTitle?: string;
  advancedParagraphs?: React.ReactNode[];
}

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

export const topicsData: TopicData[] = [
  {
    "id": 1,
    "slug": "1-what-is-node-js-really",
    "title": "What is Node.js really? (The V8 Engine & Libuv)",
    "shortTitle": "What is Node.js really?",
    "section": "Core Execution & Event Loop",
    ...topic1Content
  },
  {
    "id": 2,
    "slug": "2-the-event-loop-explained",
    "title": "The Event Loop Explained (Phases and Timers)",
    "shortTitle": "The Event Loop Explained",
    "section": "Core Execution & Event Loop",
    ...topic2Content
  },
  {
    "id": 3,
    "slug": "3-process-nexttick",
    "title": "process.nextTick() vs setImmediate()",
    "shortTitle": "process.nextTick",
    "section": "Core Execution & Event Loop",
    ...topic3Content
  },
  {
    "id": 4,
    "slug": "4-memory-management-garbage-collection",
    "title": "Memory Management & Garbage Collection",
    "shortTitle": "Memory Management & Garbage Collection",
    "section": "Core Execution & Event Loop",
    ...topic4Content
  },
  {
    "id": 5,
    "slug": "5-the-process-object",
    "title": "The process Object (Env vars, argv, exit codes)",
    "shortTitle": "The process Object",
    "section": "Core Execution & Event Loop",
    ...topic5Content
  },
  {
    "id": 6,
    "slug": "6-asynchronous-patterns",
    "title": "Asynchronous Patterns (Promises & Async/Await deep dive)",
    "shortTitle": "Asynchronous Patterns",
    "section": "Core Execution & Event Loop",
    ...topic6Content
  },
  {
    "id": 7,
    "slug": "7-the-path-module",
    "title": "The path module (Cross-platform path resolution)",
    "shortTitle": "The path module",
    "section": "File System Mastery",
    ...topic7Content
  },
  {
    "id": 8,
    "slug": "8-fs-readfilesync-vs-fs-readfile",
    "title": "fs.readFileSync vs fs.readFile (When to block)",
    "shortTitle": "fs.readFileSync vs fs.readFile",
    "section": "File System Mastery",
    ...topic8Content
  },
  {
    "id": 9,
    "slug": "9-the-fs-promises-api",
    "title": "The fs/promises API",
    "shortTitle": "The fs/promises API",
    "section": "File System Mastery",
    ...topic9Content
  },
  {
    "id": 10,
    "slug": "10-watching-files-and-directories-for-changes",
    "title": "Watching files and directories for changes",
    "shortTitle": "Watching files",
    "section": "File System Mastery",
    ...topic10Content
  },
  {
    "id": 11,
    "slug": "11-reading-massive-files-without-crashing",
    "title": "Reading massive files without crashing",
    "shortTitle": "Reading massive files",
    "section": "File System Mastery",
    ...topic11Content
  },
  {
    "id": 12,
    "slug": "12-walking-directories-recursively",
    "title": "Walking directories recursively",
    "shortTitle": "Walking directories",
    "section": "File System Mastery",
    ...topic12Content
  },
  {
    "id": 13,
    "slug": "13-what-is-a-buffer",
    "title": "What is a Buffer? (Handling binary data)",
    "shortTitle": "What is a Buffer?",
    "section": "Data Handling"
  },
  {
    "id": 14,
    "slug": "14-encoding-and-decoding-strings",
    "title": "Encoding and Decoding strings",
    "shortTitle": "Encoding and Decoding strings",
    "section": "Data Handling"
  },
  {
    "id": 15,
    "slug": "15-readable-streams",
    "title": "Readable Streams (Consuming data)",
    "shortTitle": "Readable Streams",
    "section": "Data Handling"
  },
  {
    "id": 16,
    "slug": "16-writable-streams",
    "title": "Writable Streams (Writing massive logs/files)",
    "shortTitle": "Writable Streams",
    "section": "Data Handling"
  },
  {
    "id": 17,
    "slug": "17-transform-duplex-streams",
    "title": "Transform & Duplex Streams",
    "shortTitle": "Transform & Duplex Streams",
    "section": "Data Handling"
  },
  {
    "id": 18,
    "slug": "18-piping-streams-together",
    "title": "Piping Streams together (read.pipe(write))",
    "shortTitle": "Piping Streams together",
    "section": "Data Handling"
  },
  {
    "id": 19,
    "slug": "19-child-process-exec",
    "title": "child_process.exec() (Running shell commands)",
    "shortTitle": "child_process.exec",
    "section": "Multi-Processing & Concurrency"
  },
  {
    "id": 20,
    "slug": "20-child-process-spawn",
    "title": "child_process.spawn() (Long-running tasks)",
    "shortTitle": "child_process.spawn",
    "section": "Multi-Processing & Concurrency"
  },
  {
    "id": 21,
    "slug": "21-inter-process-communication",
    "title": "Inter-Process Communication (IPC)",
    "shortTitle": "Inter-Process Communication",
    "section": "Multi-Processing & Concurrency"
  },
  {
    "id": 22,
    "slug": "22-the-worker-threads-module",
    "title": "The worker_threads module",
    "shortTitle": "The worker_threads module",
    "section": "Multi-Processing & Concurrency"
  },
  {
    "id": 23,
    "slug": "23-sharing-memory-between-threads",
    "title": "Sharing memory between threads (SharedArrayBuffer)",
    "shortTitle": "Sharing memory between threads",
    "section": "Multi-Processing & Concurrency"
  },
  {
    "id": 24,
    "slug": "24-handling-process-crashes-gracefully",
    "title": "Handling process crashes gracefully",
    "shortTitle": "Handling process crashes gracefully",
    "section": "Multi-Processing & Concurrency"
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
    "title": "What is WebRTC? (Beyond just browsers)",
    "shortTitle": "What is WebRTC?",
    "section": "WebRTC & Architecture"
  },
  {
    "id": 32,
    "slug": "32-the-signaling-phase",
    "title": "The Signaling phase (How peers find each other)",
    "shortTitle": "The Signaling phase",
    "section": "WebRTC & Architecture"
  },
  {
    "id": 33,
    "slug": "33-ice-candidates-stun-and-turn-servers",
    "title": "ICE Candidates, STUN, and TURN servers",
    "shortTitle": "ICE Candidates, STUN, and TURN servers",
    "section": "WebRTC & Architecture"
  },
  {
    "id": 34,
    "slug": "34-setting-up-a-data-channel-for-p2p-messaging",
    "title": "Setting up a Data Channel for P2P messaging",
    "shortTitle": "Setting up a Data Channel for P2P messaging",
    "section": "WebRTC & Architecture"
  },
  {
    "id": 35,
    "slug": "35-establishing-a-webrtc-connection-in-node-js",
    "title": "Establishing a WebRTC connection in Node.js",
    "shortTitle": "Establishing a WebRTC connection in Node.js",
    "section": "WebRTC & Architecture"
  },
  {
    "id": 36,
    "slug": "36-broadcasting-state-changes-in-real-time",
    "title": "Broadcasting state changes in real-time",
    "shortTitle": "Broadcasting state changes in real-time",
    "section": "WebRTC & Architecture"
  },
  {
    "id": 37,
    "slug": "37-event-emitters",
    "title": "Event Emitters (Custom pub/sub patterns)",
    "shortTitle": "Event Emitters",
    "section": "WebRTC & Architecture"
  },
  {
    "id": 38,
    "slug": "38-profiling-node-js-memory-leaks",
    "title": "Profiling Node.js memory leaks",
    "shortTitle": "Profiling Node.js memory leaks",
    "section": "WebRTC & Architecture"
  },
  {
    "id": 39,
    "slug": "39-hooking-into-the-runtime",
    "title": "Hooking into the runtime (async_hooks)",
    "shortTitle": "Hooking into the runtime",
    "section": "WebRTC & Architecture"
  },
  {
    "id": 40,
    "slug": "40-bundling-node-js-code",
    "title": "Bundling Node.js code (Deployment)",
    "shortTitle": "Bundling Node.js code",
    "section": "WebRTC & Architecture"
  }
];
