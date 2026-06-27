import React from 'react';

export const topic35Content = {
  description: "Using WebRTC on the server backend.",
  difficulty: "Advanced" as const,
  paragraphs: [
    <p key="1">
      WebRTC was originally designed for Browser-to-Browser communication. But what if you want a Node.js server to join a WebRTC swarm? For example, building a server that records a group video call, or an AI backend that streams real-time audio analysis back to a browser.
    </p>,
    <p key="2">
      Node.js does not have WebRTC built-in. To use WebRTC on the backend, you must install a highly complex third-party library called <strong><code>wrtc</code></strong> or <strong><code>node-webrtc</code></strong>. These libraries bind the official Google WebRTC C++ source code to Node.js, giving you access to the exact same <code>RTCPeerConnection</code> API you use in the browser!
    </p>,
    <p key="3">
      Running WebRTC on the backend is notoriously difficult. The C++ binaries are massive, and handling thousands of UDP video streams will quickly overwhelm a standard Node.js server, usually requiring you to spawn multiple child processes or Worker Threads to distribute the CPU load.
    </p>
  ],
  basicExample: `// Using WebRTC in Node.js looks identical to the browser!
// npm install wrtc

const { RTCPeerConnection } = require('wrtc');

const peerConnection = new RTCPeerConnection({
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
});

// A Node.js backend can now create Data Channels to talk directly
// to browsers via UDP, bypassing HTTP entirely!
const dataChannel = peerConnection.createDataChannel('backendData');

dataChannel.onopen = () => {
  dataChannel.send(JSON.stringify({ status: "Node.js Server is Online via P2P!" }));
};`,
  advancedTitle: "Real-World: The SFU (Selective Forwarding Unit)",
  advancedParagraphs: [
    <p key="1">
      If 10 people join a P2P video call, each person must upload their video 9 times (once to every other person). This destroys the user's home internet bandwidth.
    </p>,
    <p key="2">
      To solve this, companies like Zoom use an <strong>SFU (Selective Forwarding Unit)</strong> architecture. Everyone creates a WebRTC connection to a central Node.js/C++ server. The user uploads their video <em>once</em> to the server, and the server forwards it to the other 9 people.
    </p>
  ],
  advancedExample: `// SFU Architecture Concept
// 1. User A (Browser) streams Video to Node.js Server
// 2. Node.js Server extracts the raw Video Track
// 3. Node.js Server attaches User A's Video Track to the WebRTC
//    connections belonging to User B, User C, and User D.

// SFUs require immense CPU power and are usually built with
// specialized frameworks like MediaSoup or Janus, rather than
// raw node-webrtc.`
};
