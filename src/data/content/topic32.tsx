import React from 'react';

export const topic32Content = {
  description: "How peers find each other using a central server.",
  difficulty: "Intermediate" as const,
  paragraphs: [
    <p key="1">
      Before WebRTC can establish a direct peer-to-peer connection, the two browsers must exchange metadata. They need to know what codecs the other browser supports, and what IP addresses they can be reached at.
    </p>,
    <p key="2">
      This initial exchange is called the <strong>Signaling Phase</strong>. WebRTC explicitly <em>does not</em> dictate how signaling works. You have to build it yourself!
    </p>,
    <p key="3">
      The standard way to build a Signaling Server is by using the WebSocket server we built in Module V. Alice connects to our Node.js WebSocket server and sends an "Offer". The server instantly broadcasts that Offer to Bob. Bob generates an "Answer" and sends it back to the server, which forwards it to Alice. Once the Offer and Answer are exchanged, the WebSocket server is no longer needed for the video stream!
    </p>
  ],
  basicExample: `// 1. ALICE creates an Offer and sends it to the Signaling Server
const peerConnection = new RTCPeerConnection();

const offer = await peerConnection.createOffer();
await peerConnection.setLocalDescription(offer);

// Send it over our WebSocket!
webSocket.send(JSON.stringify({ type: 'offer', sdp: offer }));

// -------------------------------------------------------------

// 2. BOB receives the Offer from the Signaling Server
webSocket.onmessage = async (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'offer') {
    // Bob accepts Alice's offer
    await peerConnection.setRemoteDescription(data.sdp);
    
    // Bob generates an Answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    
    // Send it back to Alice over the WebSocket!
    webSocket.send(JSON.stringify({ type: 'answer', sdp: answer }));
  }
};`,
  advancedTitle: "Real-World: Node.js Signaling Server",
  advancedParagraphs: [
    <p key="1">
      What does the Node.js server actually look like during this phase? It is incredibly simple. It acts purely as a dumb router.
    </p>,
    <p key="2">
      It doesn't parse the WebRTC SDP objects, it doesn't care if it's video or audio. It just receives a JSON payload from Alice and immediately pushes it to Bob.
    </p>
  ],
  advancedExample: `const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 8080 });

// A dumb Signaling Server that just broadcasts messages
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    
    // Broadcast the Offer/Answer to everyone else in the room
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(message.toString());
      }
    });
    
  });
});`
};
