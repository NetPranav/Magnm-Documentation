import React from 'react';

export const topic36Content = {
  description: "Synchronizing Application State across multiple clients.",
  difficulty: "Advanced" as const,
  paragraphs: [
    <p key="1">
      Whether you are using WebSockets or WebRTC Data Channels, simply sending a message is easy. The hard part of Real-Time engineering is <strong>State Synchronization</strong>.
    </p>,
    <p key="2">
      If 100 people are collaborating on a Google Doc, or moving cursors around in Figma, the central server (or the host peer in a P2P mesh) must maintain the "Truth". When a client makes a change, they don't send the entire 10MB document over the wire. They send a tiny <strong>Delta</strong> (e.g., "I inserted the letter 'A' at index 45").
    </p>,
    <p key="3">
      The Server validates this Delta, updates its master state, and broadcasts the Delta to the other 99 users so their screens update instantly. Handling race conditions (what if two users type at index 45 at the exact same millisecond?) requires complex algorithms like CRDTs (Conflict-free Replicated Data Types) or Operational Transformation.
    </p>
  ],
  basicExample: `// A basic State Synchronization Server Concept
const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 8080 });

// The Master State
let documentText = "";

wss.on('connection', (ws) => {
  // 1. Send the initial full state to the new client
  ws.send(JSON.stringify({ type: 'INIT', state: documentText }));

  ws.on('message', (message) => {
    const action = JSON.parse(message);
    
    // 2. Client sends a Delta (e.g. { type: 'APPEND', char: 'A' })
    if (action.type === 'APPEND') {
      documentText += action.char; // Update Truth
      
      // 3. Broadcast ONLY the Delta to everyone else
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === 1) {
          client.send(JSON.stringify(action));
        }
      });
    }
  });
});`,
  advancedTitle: "Real-World: Vector Clocks",
  advancedParagraphs: [
    <p key="1">
      In a pure Peer-to-Peer network (no central server), state synchronization is extremely difficult. If Alice goes offline, makes changes locally, and then reconnects to Bob, how do they merge their changes without overwriting each other?
    </p>,
    <p key="2">
      Distributed systems use <strong>Vector Clocks</strong> or <strong>Logical Clocks</strong>. Every action is tagged with a timestamp and an incrementing counter for each peer. This allows the system to definitively sort events and resolve conflicts without needing a central server to decide what happened first.
    </p>
  ],
  advancedExample: `// A conceptual CRDT message payload in a P2P network
const p2pDelta = {
  operation: "INSERT",
  char: "X",
  position: 45,
  vectorClock: {
    "alice_id": 142, // Alice has made 142 edits
    "bob_id": 89     // Bob has made 89 edits
  },
  timestamp: 1690000000000
};

// When Bob receives this, he compares the vectorClock against his own
// to determine if he missed any previous messages, or if Alice's 
// edit happened concurrently with one of his own local edits!`,
  miniProject: {
    title: "The Collaborative Whiteboard Sync",
    description: (
      <>
        <p>
          <strong>Goal:</strong> Build a WebSocket server that synchronizes drawing coordinates between multiple clients to create a shared whiteboard.
        </p>
        <p>
          Your server should maintain an array of <code>lines</code> (the master state). When a new client connects, send them the entire <code>lines</code> array so they can render the current drawing. When a client draws a new line segment, they will send a JSON object with <code>{'{ "type": "DRAW", "line": { x1, y1, x2, y2 } }'}</code>. Append this to the master state, and broadcast it to all other clients.
        </p>
      </>
    ),
    code: `const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 8080 });

// The Master State
const drawingState = {
  lines: []
};

wss.on('connection', (ws) => {
  // 1. Send the full current drawing to the new user
  ws.send(JSON.stringify({ 
    type: 'SYNC', 
    data: drawingState.lines 
  }));

  ws.on('message', (message) => {
    try {
      const payload = JSON.parse(message);
      
      if (payload.type === 'DRAW') {
        // 2. Update the master state
        drawingState.lines.push(payload.line);
        
        // 3. Broadcast the tiny Delta to all OTHER users
        wss.clients.forEach(client => {
          if (client !== ws && client.readyState === 1) {
            client.send(JSON.stringify({
              type: 'DRAW',
              data: payload.line
            }));
          }
        });
      }
    } catch (e) {
      console.error("Invalid JSON received");
    }
  });
});

console.log("Whiteboard Sync Server running on port 8080");`
  }
};
