import React from 'react';

export const topic18Content = {
  description: "Connecting Streams together to create highly efficient data pipelines.",
  paragraphs: [
    <p key="1">
      Now that we have <strong>Readable Streams</strong> (data sources) and <strong>Writable Streams</strong> (data destinations), we need a way to connect them. While we could manually listen to the <code>'data'</code> event on the Readable stream and call <code>write()</code> on the Writable stream, Node.js provides a built-in method for this: <code>.pipe()</code>.
    </p>,
    <p key="2">
      Piping automatically manages the data flow between streams. It flawlessly handles <strong>backpressure</strong>, meaning if the Writable stream is slower than the Readable stream (e.g., writing to a slow hard drive but reading from a fast SSD), <code>.pipe()</code> will automatically pause the Readable stream until the Writable stream catches up!
    </p>,
    <p key="3">
      You can chain multiple streams together, usually placing <strong>Transform Streams</strong> in the middle of the pipeline to mutate the data as it flows through.
    </p>
  ],
  basicExample: `const fs = require('fs');

// 1. We want to copy a 5GB file.
const source = fs.createReadStream('massive_database.sql');
const destination = fs.createWriteStream('database_backup.sql');

// 2. Instead of loading it into memory, we PIPE them!
// Data flows directly from source -> destination
source.pipe(destination);

destination.on('finish', () => {
  console.log('5GB File copied instantly using ~64KB of RAM!');
});`,
  advancedTitle: "Real-World: On-the-fly Server Zipping",
  advancedParagraphs: [
    <p key="1">
      Let's look at a classic real-world requirement: A user clicks "Download All Photos" on your website.
    </p>,
    <p key="2">
      You need to grab 1,000 photos from the server's hard drive, compress them into a single <code>.zip</code> file, and send it to the user. If you use a standard ZIP library, it will try to create the entire ZIP file in your server's RAM before sending it, instantly crashing your Node.js application.
    </p>,
    <p key="3">
      Instead, we can construct an elegant <strong>Pipeline</strong>. We read the files, pipe them into a streaming ZIP archiver (a Transform stream), and pipe the output of that archiver <em>directly</em> into the HTTP Response (a Writable stream)!
    </p>
  ],
  advancedExample: `const http = require('http');
const fs = require('fs');
const zlib = require('zlib'); // Built-in gzip compression

const server = http.createServer((req, res) => {
  if (req.url === '/download-logs') {
    // 1. Tell browser to expect a downloaded file
    res.writeHead(200, {
      'Content-Type': 'application/gzip',
      'Content-Disposition': 'attachment; filename="logs.gz"'
    });

    // 2. Create the Streams
    const readStream = fs.createReadStream('/var/log/server.log');
    const compressStream = zlib.createGzip(); // Transform Stream

    // 3. Pipe them all together!
    // Hard Drive -> Compression Engine -> HTTP Response -> User's Browser
    readStream.pipe(compressStream).pipe(res);
    
    // (Note: In modern Node.js, we prefer the 'stream/promises' pipeline() 
    // utility to handle error propagation cleanly, but .pipe is the core concept!)
  }
});

server.listen(3000);`
};
