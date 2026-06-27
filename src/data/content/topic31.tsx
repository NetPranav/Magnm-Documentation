import React from 'react';

export const topic31Content = {
  description: "The protocol powering real-time peer-to-peer communication.",
  difficulty: "Beginner" as const,
  paragraphs: [
    <p key="1">
      Up until now, all of our communication has been <strong>Client-Server</strong>. If Alice wants to send a chat message to Bob, Alice sends it to the Server, and the Server forwards it to Bob. This is great for centralized control, but it introduces latency and requires you to pay for expensive servers to route all that bandwidth.
    </p>,
    <p key="2">
      <strong>WebRTC (Web Real-Time Communication)</strong> allows Alice's browser to connect <em>directly</em> to Bob's browser! Once connected, they can stream high-definition video, audio, or arbitrary binary data to each other instantly, completely bypassing your server.
    </p>,
    <p key="3">
      WebRTC is built into all modern browsers. It uses UDP instead of TCP for maximum speed, which is why it's the technology powering Zoom, Google Meet, and Discord voice chats.
    </p>
  ],
  basicExample: `// A very high-level overview of the WebRTC API in the browser

// 1. Create a new Peer Connection
const peerConnection = new RTCPeerConnection();

// 2. Add your microphone/webcam stream to the connection
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then((stream) => {
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  });

// 3. Listen for incoming video from the remote peer
peerConnection.ontrack = (event) => {
  const remoteVideoElement = document.getElementById('remoteVideo');
  remoteVideoElement.srcObject = event.streams[0];
};

// 4. (We are missing a massive step here: How do they actually find each other?
// We will cover the "Signaling Phase" in the next topic!)`,
  advancedTitle: "Real-World: Why P2P is Hard",
  advancedParagraphs: [
    <p key="1">
      If Alice wants to connect to Bob directly, she needs Bob's IP address. 
    </p>,
    <p key="2">
      However, almost no computer is directly connected to the internet. We sit behind home routers and Corporate Firewalls that assign us fake local IP addresses (like <code>192.168.1.5</code>). If Alice tries to connect to <code>192.168.1.5</code>, she will just hit her own local network!
    </p>,
    <p key="3">
      WebRTC solves this using a technique called <strong>NAT Traversal</strong>. We still need a tiny, central server to help Alice and Bob figure out their public IP addresses and exchange them. Once they find each other, the server steps out of the way.
    </p>
  ],
  advancedExample: `// The theoretical P2P journey:

// 1. Alice's computer: "I am at 192.168.1.5" (Useless)
// 2. Alice asks a public STUN Server: "What is my real IP?"
// 3. STUN Server: "To the outside world, you are at 203.0.113.1, Port 55000"
// 4. Alice sends this information to Bob (via our standard WebSocket server)
// 5. Bob does the same thing.
// 6. Alice and Bob now have each other's public addresses and connect directly!
// 7. Video streams instantly with zero server costs!`
};
