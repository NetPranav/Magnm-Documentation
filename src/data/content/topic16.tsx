import React from 'react';

export const topic16Content = {
  description: "How to output massive amounts of data piece-by-piece.",
  paragraphs: [
    <p key="1">
      If a <code>Readable</code> Stream is a water hose pouring out data, a <strong>Writable Stream</strong> is the bucket collecting it. It provides a way to output raw binary data (Buffers) piece-by-piece to a destination.
    </p>,
    <p key="2">
      Common destinations for Writable Streams include writing to a file on a hard drive (<code>fs.createWriteStream</code>), sending an HTTP response back to a client (<code>res</code> in Express), or writing to a TCP socket.
    </p>,
    <p key="3">
      The most important concept in Writable Streams is <strong>Drain</strong>. If you try to pour water into the bucket faster than the bucket can empty itself into the file system, the stream's internal memory buffer will fill up. Node.js will tell you to pause pouring by returning <code>false</code> when you call <code>write()</code>. Once the bucket has emptied, it emits a <code>'drain'</code> event, signaling you can start pouring again.
    </p>
  ],
  basicExample: `const fs = require('fs');

// 1. Create a Writable Stream to a new file
const writeStream = fs.createWriteStream('./output.txt');

// 2. Write chunks of data (Buffers or Strings)
writeStream.write('Hello, ');
writeStream.write('World!\\n');

// 3. Close the stream when you are completely finished
writeStream.end('This is the final line.');

writeStream.on('finish', () => {
  console.log('All data has been successfully written to disk.');
});`,
  advancedTitle: "Real-World: Video Streaming Server",
  advancedParagraphs: [
    <p key="1">
      Instead of our File Sync Engine, let's look at <strong>Video Streaming</strong> (like Netflix or YouTube).
    </p>,
    <p key="2">
      When a user watches a movie, your Node.js server cannot send the entire 2GB MP4 file at once. The user's browser would freeze, and your server would run out of RAM.
    </p>,
    <p key="3">
      Instead, the HTTP Response object (<code>res</code>) in Node.js is actually a <strong>Writable Stream</strong>. We can read the video from the hard drive as a Readable stream, and write it directly to the HTTP Response chunk-by-chunk. The user's browser plays the chunks as they arrive!
    </p>
  ],
  advancedExample: `const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/video') {
    // 1. Set the correct HTTP headers for video streaming
    res.writeHead(200, { 'Content-Type': 'video/mp4' });

    // 2. Open a Readable Stream for the massive movie file
    const videoStream = fs.createReadStream('./massive_movie.mp4');

    // 3. Write chunks to the HTTP Response (which is a Writable Stream)
    videoStream.on('data', (chunk) => {
      // If the user's internet is slow, res.write() returns false
      const canContinue = res.write(chunk);
      
      if (!canContinue) {
        videoStream.pause(); // Stop reading from disk!
      }
    });

    // 4. When the HTTP Response is ready for more, resume reading
    res.on('drain', () => {
      videoStream.resume(); 
    });

    // 5. End the response when the movie finishes
    videoStream.on('end', () => {
      res.end();
    });
  }
});

server.listen(3000);`
};
