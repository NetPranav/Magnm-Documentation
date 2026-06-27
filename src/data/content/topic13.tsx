import React from 'react';

export const topic13Content = {
  description: "Understanding how Node.js handles raw binary data using Buffers.",
  paragraphs: [
    <p key="1">
      JavaScript was originally designed for the browser, dealing mostly with strings and numbers. However, when Node.js was created to run on servers, it needed a way to interact with the network, file systems, and databases—all of which send and receive <strong>raw binary data</strong> (streams of 0s and 1s).
    </p>,
    <p key="2">
      To solve this, Node.js introduced the <code>Buffer</code> class. A Buffer is essentially a fixed-size chunk of memory allocated outside the V8 JavaScript engine. It holds raw binary data, which is typically represented in your console as a sequence of hexadecimal numbers (e.g., <code>&lt;Buffer 48 65 6c 6c 6f&gt;</code>).
    </p>
  ],
  basicExample: `// 1. Creating a Buffer from a string
const buf = Buffer.from('Hello');
console.log(buf); 
// Output: <Buffer 48 65 6c 6c 6f>

// 2. Converting it back to a string
console.log(buf.toString()); 
// Output: 'Hello'

// 3. Allocating an empty Buffer of exactly 10 bytes
const emptyBuf = Buffer.alloc(10);
console.log(emptyBuf); 
// Output: <Buffer 00 00 00 00 00 00 00 00 00 00>`,
  advancedTitle: "Real-World: Binary Image Processing",
  advancedParagraphs: [
    <p key="1">
      While our <strong>File Sync Engine</strong> heavily relies on Buffers under the hood, let's look at a different real-world example: <strong>Image Processing</strong>.
    </p>,
    <p key="2">
      If a user uploads a JPEG avatar to your server, that image arrives as a Buffer of raw bytes. If you want to check if the file is actually a valid JPEG (and not a malicious script disguised as a .jpg), you can't just read the string. You have to inspect the "Magic Numbers" (the first few bytes of the file) in the raw Buffer.
    </p>
  ],
  advancedExample: `const fs = require('fs');

// Read an uploaded file into a Buffer
const imageBuffer = fs.readFileSync('uploaded_avatar.jpg');

// JPEGs always start with the exact byte sequence: FF D8 FF
// We can check the first 3 bytes of the Buffer directly:
const isJPEG = 
  imageBuffer[0] === 0xFF && 
  imageBuffer[1] === 0xD8 && 
  imageBuffer[2] === 0xFF;

if (isJPEG) {
  console.log("Valid JPEG detected! Safe to save.");
} else {
  console.log("SECURITY ALERT: This is not a real JPEG!");
}`
};
