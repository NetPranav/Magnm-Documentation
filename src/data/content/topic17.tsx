import React from 'react';

export const topic17Content = {
  description: "Streams that can both read and write data simultaneously.",
  paragraphs: [
    <p key="1">
      We've explored Readable Streams (which only output data) and Writable Streams (which only consume data). But what if you need a stream that does both? 
    </p>,
    <p key="2">
      A <strong>Duplex Stream</strong> is exactly that: it implements both the Readable and Writable interfaces. A TCP Socket (a network connection) is a perfect example of a Duplex Stream. You can write data to the socket (sending a message to a server) while simultaneously listening for the <code>'data'</code> event to read incoming messages from the server.
    </p>,
    <p key="3">
      A <strong>Transform Stream</strong> is a special type of Duplex Stream where the output is directly calculated from the input. For example, if you pass a file through a compression Transform stream (like <code>zlib.createGzip()</code>), it consumes the raw file data (Writable) and outputs the compressed data (Readable).
    </p>
  ],
  basicExample: `const { Transform } = require('stream');

// 1. Create a custom Transform Stream
const uppercaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    // 2. We receive a chunk (Buffer), convert it to string, 
    // make it uppercase, and push it out the other side.
    const upperStr = chunk.toString().toUpperCase();
    this.push(upperStr);
    
    // 3. Call the callback to indicate we are done with this chunk
    callback();
  }
});

// 4. We listen for output from the stream (Readable side)
uppercaseTransform.on('data', (data) => {
  console.log("Transformed Output:", data.toString());
});

// 5. We write data into the stream (Writable side)
uppercaseTransform.write('hello ');
uppercaseTransform.write('world!');
uppercaseTransform.end();`,
  advancedTitle: "Real-World: File Encryption on the Fly",
  advancedParagraphs: [
    <p key="1">
      Let's apply this to our <strong>Real-time P2P File Sync Engine</strong>.
    </p>,
    <p key="2">
      We want our engine to be highly secure. Before we save any synced file to the hard drive, we want to encrypt it so that if a laptop is stolen, the files cannot be read.
    </p>,
    <p key="3">
      If we try to encrypt a 10GB file in memory, the server crashes. Instead, we can create an encryption <strong>Transform Stream</strong>. It will take the raw incoming binary chunks, encrypt them on the fly, and pass the encrypted chunks to a Writable Stream to be saved on the disk!
    </p>
  ],
  advancedExample: `const crypto = require('crypto');
const fs = require('fs');

// We use AES-256 for military-grade encryption
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // 256-bit key
const iv = crypto.randomBytes(16);  // Initialization vector

// 1. Create the Transform Stream (Encryptor)
const encryptStream = crypto.createCipheriv(algorithm, key, iv);

// 2. Create the Readable and Writable streams
const readStream = fs.createReadStream('sensitive_data.txt');
const writeStream = fs.createWriteStream('encrypted_data.enc');

// 3. Chain them together!
// Data flows: Disk -> Node (Encrypt) -> Disk
readStream.pipe(encryptStream).pipe(writeStream);

writeStream.on('finish', () => {
  console.log('Massive file encrypted successfully without using RAM!');
});`
};
