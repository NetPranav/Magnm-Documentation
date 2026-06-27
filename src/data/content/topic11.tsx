import React from 'react';

export const topic11Content = {
  description: "An introduction to Node.js Streams for massive data processing.",
  imageUrl: "/assets/images/streams-v2.png",
  imageAlt: "Node.js Streams vs RAM Usage Diagram",
  paragraphs: [
    <p key="1">
      Up until now, we have used <code>fs.readFile</code> to load files. When you use <code>fs.readFile</code>, Node.js takes the entire file from the hard drive and loads it directly into RAM (the V8 Heap).
    </p>,
    <p key="2">
      If you read a 10MB JSON file, it takes 10MB of RAM. But what if a user asks your application to read a 10GB video file? V8 only allocates about 1.5GB of memory by default. Attempting to load the 10GB file into memory all at once will instantly crash your application with a fatal <code>JavaScript heap out of memory</code> error.
    </p>,
    <p key="3">
      The solution is <strong>Streams</strong>. Instead of loading the entire file at once, a Stream reads the file in tiny chunks (e.g., 64KB at a time), processes that chunk, and then immediately deletes it from RAM to make room for the next chunk.
    </p>
  ],
  basicExample: `const fs = require('fs');

// Create a readable stream pointing to a massive 10GB file
const stream = fs.createReadStream('massive-video.mp4');

// The 'data' event fires every time a 64KB chunk is read from disk
stream.on('data', (chunk) => {
  console.log(\`Received \${chunk.length} bytes of data.\`);
  // Process the chunk here, then it gets garbage collected!
});

// The 'end' event fires when the whole file has been processed
stream.on('end', () => {
  console.log('Finished reading the massive file!');
});`,
  advancedTitle: "Real-World: P2P Chunk Uploading",
  advancedParagraphs: [
    <p key="1">
      Let's apply this to our <strong>Real-time P2P File Sync Engine</strong>.
    </p>,
    <p key="2">
      If one developer wants to sync a 4GB Docker image to their peer over WebRTC, they absolutely cannot read it into memory and send it in one massive WebRTC message. The browser/Node.js socket would explode.
    </p>,
    <p key="3">
      Instead, we use a <strong>Readable Stream</strong> to read the Docker image chunk by chunk, and we send those individual chunks over the WebRTC Data Channel in real-time. This keeps our Engine's memory footprint incredibly tiny (under 100MB), no matter how large the synced file is.
    </p>
  ],
  advancedExample: `const fs = require('fs');

// Inside our File Sync Engine...
function syncMassiveFileToPeer(filePath, webRtcChannel) {
  console.log(\`Starting streaming sync for: \${filePath}\`);
  
  // 1. Open a stream instead of using readFile
  const stream = fs.createReadStream(filePath, { 
    highWaterMark: 64 * 1024 // 64KB chunks (perfect for WebRTC) 
  });

  // 2. As each 64KB chunk is read from disk...
  stream.on('data', (chunk) => {
    // We send just this tiny piece over the network!
    webRtcChannel.send(chunk);
  });

  // 3. Handle completion
  stream.on('end', () => {
    console.log('Sync complete! Memory usage stayed flat.');
    webRtcChannel.send({ type: 'EOF' }); // Tell peer we are done
  });

  // 4. Always handle errors to prevent crashes
  stream.on('error', (err) => {
    console.error('Failed to stream file:', err);
  });
}`,
  extraExamples: [
    {
      title: "Edge Case: Piping & Transform Streams",
      paragraphs: [
        <p key="1">
          Streams get incredibly powerful when you connect them together using <code>.pipe()</code>. For example, what if we wanted to compress (ZIP) that 4GB Docker image before saving a backup to our hard drive? We can pipe a Readable Stream directly into a Compression Stream, and then pipe that directly into a Writable Stream! Data flows continuously without ever filling up RAM.
        </p>
      ],
      code: `const fs = require('fs');
const zlib = require('zlib'); // Built-in compression

// 1. Read the raw 4GB file
const readStream = fs.createReadStream('docker-image.tar');

// 2. Compress the data on the fly (Transform Stream)
const gzipStream = zlib.createGzip();

// 3. Write the compressed data to a new file
const writeStream = fs.createWriteStream('docker-image.tar.gz');

// Connect them all together!
// Data flows: Disk -> Node (Compress) -> Disk
readStream
  .pipe(gzipStream)
  .pipe(writeStream)
  .on('finish', () => {
    console.log('Successfully compressed 4GB file using minimal RAM!');
  });`
    }
  ]
};
