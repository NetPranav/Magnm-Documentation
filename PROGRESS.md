# Node.js Advanced Architecture & Progress

This file tracks the architecture of the project and the completion progress of the 40 topics designed to master Node.js for complex VS Code Extension development.

## Architecture

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **UI Paradigm**: Classic, minimalist white theme with neutral accents. High contrast typography.
- **Core Component**: `SyntaxHoverCode.tsx` - A custom React component that tokenizes JavaScript code so readers can hover over basic keywords to see a helpful tooltip explaining the syntax.
- **Routing**: Each topic below will be implemented as its own Next.js route, focusing on deeply technical concepts explained simply.

## Running Example: Real-time P2P File Sync Engine
To connect all 40 topics practically, this documentation uses a single, overarching project: building a local file-sync tool that watches a directory and syncs changes to a remote peer via WebRTC. 
* **Basic Examples** show bare-minimum syntax.
* **Advanced Examples** show how the concept is applied to the File Sync Engine.

## Topic Progress Tracker (40 / 40 Completed - Scaffolded)

### I. Core Execution & Event Loop
- [x] 1. What is Node.js really? (The V8 Engine & Libuv)
- [x] 2. The Event Loop Explained (Phases and Timers)
- [x] 3. `process.nextTick()` vs `setImmediate()`
- [x] 4. Memory Management & Garbage Collection
- [x] 5. The `process` Object (Env vars, argv, exit codes)
- [x] 6. Asynchronous Patterns (Promises & Async/Await deep dive)

### II. File System Mastery
- [x] 7. The `path` module (Cross-platform path resolution)
- [x] 8. `fs.readFileSync` vs `fs.readFile` (When to block)
- [x] 9. The `fs/promises` API
- [x] 10. Watching files and directories for changes
- [x] 11. Reading massive files without crashing
- [x] 12. Walking directories recursively

### III. Data Handling
- [x] 13. What is a Buffer? (Handling binary data)
- [x] 14. Encoding and Decoding strings
- [x] 15. Readable Streams (Consuming data)
- [x] 16. Writable Streams (Writing massive logs/files)
- [x] 17. Transform & Duplex Streams
- [x] 18. Piping Streams together (`read.pipe(write)`)

### IV. Multi-Processing & Concurrency
- [x] 19. `child_process.exec()` (Running shell commands)
- [x] 20. `child_process.spawn()` (Long-running tasks)
- [x] 21. Inter-Process Communication (IPC)
- [x] 22. The `worker_threads` module
- [x] 23. Sharing memory between threads (`SharedArrayBuffer`)
- [x] 24. Handling process crashes gracefully

### V. Networking & Real-Time
- [x] 25. The `net` module (TCP Sockets)
- [x] 26. Creating a basic TCP Server
- [x] 27. The `http` module under the hood
- [x] 28. Introduction to WebSockets
- [x] 29. Building a local WebSocket server
- [x] 30. Connecting to external APIs (The native `fetch` API)

### VI. WebRTC & Architecture
- [x] 31. What is WebRTC? (Beyond just browsers)
- [x] 32. The Signaling phase (How peers find each other)
- [x] 33. ICE Candidates, STUN, and TURN servers
- [x] 34. Setting up a Data Channel for P2P messaging
- [x] 35. Establishing a WebRTC connection in Node.js
- [x] 36. Broadcasting state changes in real-time
- [x] 37. Event Emitters (Custom pub/sub patterns)
- [x] 38. Profiling Node.js memory leaks
- [x] 39. Hooking into the runtime (`async_hooks`)
- [x] 40. Bundling Node.js code (Deployment)
