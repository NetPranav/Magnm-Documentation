import React from 'react';

export const topic33Content = {
  description: "Bypassing firewalls and NAT routers.",
  difficulty: "Advanced" as const,
  paragraphs: [
    <p key="1">
      We discussed the <strong>Signaling Phase</strong> where Alice sends an Offer to Bob. But what exactly is <em>in</em> that Offer? It contains SDP data (media formats) and <strong>ICE Candidates</strong>.
    </p>,
    <p key="2">
      An ICE Candidate is simply a potential IP address and Port where Alice can be reached. Because Alice sits behind a home Wi-Fi router, her computer only knows its local IP (<code>192.168.x.x</code>). She must ask a public <strong>STUN Server</strong> to look at her incoming connection and tell her what her public, internet-facing IP address is. She then includes this public IP in her list of ICE Candidates.
    </p>,
    <p key="3">
      Sometimes, Corporate Firewalls are so strict that peer-to-peer connections are completely blocked. In this worst-case scenario, WebRTC falls back to a <strong>TURN Server</strong>. A TURN server is an expensive, high-bandwidth relay server. If P2P fails, Alice streams her video to the TURN server, and the TURN server streams it to Bob, completely defeating the purpose of P2P (but ensuring the call doesn't drop).
    </p>
  ],
  basicExample: `// Configuring STUN and TURN servers when creating a WebRTC connection

const configuration = {
  iceServers: [
    // 1. Free, lightweight STUN servers provided by Google
    { urls: 'stun:stun.l.google.com:19302' },
    
    // 2. Paid, high-bandwidth TURN servers as a fallback
    {
      urls: 'turn:turn.mycompany.com:3478',
      username: 'user1',
      credential: 'password1'
    }
  ]
};

const peerConnection = new RTCPeerConnection(configuration);

// WebRTC will automatically fetch candidates in the background!
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    // Send this candidate to Bob via our WebSocket Signaling Server!
    webSocket.send(JSON.stringify({
      type: 'ice-candidate',
      candidate: event.candidate
    }));
  }
};`,
  advancedTitle: "Real-World: The ICE Trickle",
  advancedParagraphs: [
    <p key="1">
      Querying STUN servers takes time. If Alice waited to collect all possible network routes before generating her Offer, the call connection time would be extremely slow.
    </p>,
    <p key="2">
      Instead, WebRTC uses <strong>Trickle ICE</strong>. Alice generates her Offer instantly with whatever local IPs she has, and sends it to Bob. As her browser discovers new public IPs from the STUN server in the background, she "trickles" (streams) these new ICE Candidates to Bob one by one via the WebSocket server.
    </p>
  ],
  advancedExample: `// On BOB's side: Receiving Trickled ICE Candidates

webSocket.onmessage = async (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'ice-candidate') {
    // Bob receives a new network route from Alice
    try {
      await peerConnection.addIceCandidate(data.candidate);
      console.log("Successfully added new routing path!");
    } catch (e) {
      console.error("Error adding received ice candidate", e);
    }
  }
};`
};
