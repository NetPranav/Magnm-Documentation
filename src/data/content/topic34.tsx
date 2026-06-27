import React from 'react';

export const topic34Content = {
  description: "Sending arbitrary binary data over a P2P connection.",
  difficulty: "Intermediate" as const,
  paragraphs: [
    <p key="1">
      WebRTC is famous for Video and Audio streaming, but it has a hidden superpower: <strong>Data Channels</strong>.
    </p>,
    <p key="2">
      A Data Channel allows you to send raw text, JSON, or massive binary files directly between two browsers. It acts exactly like a WebSocket, but it is purely Peer-to-Peer! This is the technology that powers browser-based torrenting sites and P2P file-sharing apps like Snapdrop.
    </p>,
    <p key="3">
      Unlike video streams (which always use UDP and drop packets if the network is bad), Data Channels can be configured to be <em>Reliable</em> and <em>Ordered</em> (mimicking TCP). If a piece of a file gets lost in transit, WebRTC will automatically request retransmission.
    </p>
  ],
  basicExample: `const peerConnection = new RTCPeerConnection(config);

// 1. Create a Data Channel (Must be done BEFORE creating the Offer!)
const dataChannel = peerConnection.createDataChannel('fileTransfer', {
  ordered: true,    // Ensure data arrives in the exact order it was sent
  maxRetransmits: 3 // Retry up to 3 times if packets are lost
});

// 2. Listen for when the channel successfully opens
dataChannel.onopen = () => {
  console.log("P2P Data Channel is open!");
  dataChannel.send(JSON.stringify({ message: "Hello Peer!" }));
};

// 3. Listen for incoming messages from the peer
dataChannel.onmessage = (event) => {
  console.log("Received data:", event.data);
};`,
  advancedTitle: "Real-World: P2P File Sharing",
  advancedParagraphs: [
    <p key="1">
      If you want to send a 1GB video file directly to a friend using WebRTC, you cannot load the entire 1GB file into RAM and send it in one go. The browser will crash, and WebRTC has internal limits on maximum message size (usually around 16KB - 64KB).
    </p>,
    <p key="2">
      You must read the file in small <strong>Chunks</strong> using the browser's File API, and send those chunks sequentially over the Data Channel. The receiving peer collects the chunks in a <code>Blob</code> and downloads the final file to their hard drive once it is complete!
    </p>
  ],
  advancedExample: `// Sender: Chunking a file
const CHUNK_SIZE = 16384; // 16 KB

function sendFile(file) {
  const reader = new FileReader();
  let offset = 0;

  reader.onload = (e) => {
    dataChannel.send(e.target.result); // Send the chunk
    offset += e.target.result.byteLength;

    if (offset < file.size) {
      readSlice(offset); // Read the next chunk
    } else {
      dataChannel.send('EOF'); // Tell receiver we are done
    }
  };

  const readSlice = (o) => {
    const slice = file.slice(offset, o + CHUNK_SIZE);
    reader.readAsArrayBuffer(slice);
  };

  readSlice(0); // Start reading
}`
};
