import React from 'react';

export const topic20Content = {
  description: "Streaming massive amounts of data back and forth with external processes.",
  imageUrl: "/assets/images/spawn.png",
  imageAlt: "Node.js child_process.spawn Architecture Diagram",
  paragraphs: [
    <p key="1">
      While <code>child_process.exec()</code> is great for quick commands, it buffers the entire output in memory. If you run a command that outputs gigabytes of data, your Node.js application will crash.
    </p>,
    <p key="2">
      This is where <code>child_process.spawn()</code> comes in. Instead of buffering the output, <code>spawn()</code> returns a <strong>Stream</strong>. As we learned in Module III, streams are extremely memory efficient. 
    </p>,
    <p key="3">
      When you spawn a child process, Node.js establishes three standard streams between the main process and the child: <code>stdin</code> (Writable), <code>stdout</code> (Readable), and <code>stderr</code> (Readable). You can pipe massive amounts of data into the child process, and pipe the output directly to a file or an HTTP response!
    </p>
  ],
  basicExample: `const { spawn } = require('child_process');

// 1. Spawn a process to list files in detail (ls -lh)
// Notice how arguments are passed as an array, preventing injection attacks!
const ls = spawn('ls', ['-lh', '/usr']);

// 2. Listen to the stdout stream for incoming data chunks
ls.stdout.on('data', (data) => {
  console.log(\`Output Chunk: \${data}\`);
});

// 3. Listen to the stderr stream for errors
ls.stderr.on('data', (data) => {
  console.error(\`Error Chunk: \${data}\`);
});

// 4. Listen for the process to exit completely
ls.on('close', (code) => {
  console.log(\`Child process exited with code \${code}\`);
});`,
  advancedTitle: "Real-World: On-the-fly Video Transcoding",
  advancedParagraphs: [
    <p key="1">
      Let's look at one of the most common real-world uses for <code>spawn()</code>: <strong>Video Processing with FFmpeg</strong>.
    </p>,
    <p key="2">
      Imagine a user uploads a massive 4K video to your server. You need to convert it to a smaller 720p web-friendly format using a command-line tool called <code>ffmpeg</code>. 
    </p>,
    <p key="3">
      If you used <code>exec()</code>, Node.js would try to load the entire 4K video into RAM, and instantly crash. By using <code>spawn()</code>, we can start the `ffmpeg` process and simply let the file system handle the massive I/O, while Node.js sits back and only uses ~30MB of RAM to manage the streams!
    </p>
  ],
  advancedExample: `const { spawn } = require('child_process');
const fs = require('fs');

function transcodeVideo(inputFile, outputFile) {
  // 1. Spawn the FFmpeg tool installed on the OS
  const ffmpeg = spawn('ffmpeg', [
    '-i', inputFile,      // Input file
    '-vf', 'scale=-1:720', // Scale to 720p height
    '-c:v', 'libx264',    // H.264 codec
    '-preset', 'fast',    // Encoding speed
    outputFile            // Output file
  ]);

  // 2. FFmpeg logs its progress to stderr, not stdout!
  ffmpeg.stderr.on('data', (data) => {
    // We convert the Buffer to a string to read the progress
    console.log(\`FFmpeg Progress: \${data.toString()}\`);
  });

  // 3. Handle completion
  ffmpeg.on('close', (code) => {
    if (code === 0) {
      console.log('Video Transcoding Complete!');
    } else {
      console.error('FFmpeg process failed.');
    }
  });
}

// In a real app, this runs completely asynchronously without blocking the Event Loop!
transcodeVideo('./massive_4k_upload.mp4', './web_friendly_720p.mp4');`
};
