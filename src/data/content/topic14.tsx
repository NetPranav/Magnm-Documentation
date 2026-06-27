import React from 'react';

export const topic14Content = {
  description: "How to translate raw binary data (Buffers) back into human-readable strings.",
  paragraphs: [
    <p key="1">
      As we saw in the previous topic, Node.js handles data in the form of raw binary <code>Buffers</code>. But binary data is useless to a human reading a chat message or a JSON configuration file. We need to translate those raw bytes back into letters and words.
    </p>,
    <p key="2">
      This translation process is called <strong>Encoding</strong> and <strong>Decoding</strong>. The most common encoding standard on the web is <code>utf8</code>, which maps binary numbers to almost every character in every human language (including emojis).
    </p>,
    <p key="3">
      When you call <code>buffer.toString('utf8')</code>, Node.js decodes the raw bytes back into a JavaScript string using the UTF-8 dictionary.
    </p>
  ],
  basicExample: `// 1. A Buffer containing raw bytes
const myBuffer = Buffer.from([104, 101, 108, 108, 111, 32, 240, 159, 140, 142]);

// 2. We decode it using 'utf8' (this is the default)
const text = myBuffer.toString('utf8');

console.log(text); 
// Output: "hello 🌎"

// 3. We can also encode strings into other formats, like base64
const base64String = myBuffer.toString('base64');
console.log(base64String); 
// Output: "aGVsbG8g77iP"`,
  advancedTitle: "Real-World: Base64 Email Attachments",
  advancedParagraphs: [
    <p key="1">
      While our File Sync engine mostly deals with raw binary, let's look at another very common real-world use case: <strong>Sending Emails with Attachments</strong>.
    </p>,
    <p key="2">
      Historically, email protocols (like SMTP) were designed only for plain text (ASCII). They cannot safely transmit raw binary data (like a PDF or Image). If you try to send raw bytes over SMTP, the email server will corrupt the file.
    </p>,
    <p key="3">
      To solve this, we use <code>base64</code> encoding. Base64 takes raw binary data and translates it into a safe string using only 64 basic ASCII characters (A-Z, a-z, 0-9, +, /). It makes the file 33% larger, but ensures it survives the journey across the internet safely.
    </p>
  ],
  advancedExample: `const fs = require('fs');

// Imagine we are building an Email Server...

function createEmailAttachment(filePath) {
  // 1. Read the raw binary PDF from the hard drive
  const pdfBuffer = fs.readFileSync(filePath);
  
  // 2. Encode the binary Buffer into a safe base64 string
  // This turns raw bytes into a long string of letters/numbers
  const safeBase64String = pdfBuffer.toString('base64');
  
  // 3. Construct the email payload
  const emailPayload = {
    to: 'user@example.com',
    subject: 'Your Invoice',
    attachments: [
      {
        filename: 'invoice.pdf',
        contentType: 'application/pdf',
        data: safeBase64String // Send the string, not the binary!
      }
    ]
  };

  return emailPayload;
}`
};
