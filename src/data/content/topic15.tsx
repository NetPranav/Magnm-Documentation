import React from 'react';

export const topic15Content = {
  description: "Deep dive into consuming massive amounts of data piece-by-piece.",
  imageUrl: "/assets/images/streams-v2.png",
  imageAlt: "Node.js Readable Streams Diagram",
  paragraphs: [
    <p key="1">
      While we touched on Streams earlier to avoid crashing V8 with massive files, let's dive into exactly what a <strong>Readable Stream</strong> is under the hood. 
    </p>,
    <p key="2">
      A Readable Stream is a specialized Node.js Event Emitter that emits a <code>'data'</code> event every time it reads a chunk of binary data (a Buffer) from a source. This source could be a file on the hard drive, an incoming HTTP request, or a TCP socket. 
    </p>,
    <p key="3">
      By default, Readable Streams are in a "paused" state. They only start pulling data from the source when you attach a <code>'data'</code> listener to them. This ensures you never read data faster than your application can process it (a concept known as <strong>Backpressure</strong>).
    </p>
  ],
  basicExample: `const fs = require('fs');

// 1. Create a readable stream
const readStream = fs.createReadStream('./massive-log.txt', { 
  encoding: 'utf8', 
  highWaterMark: 64 * 1024 // Read in 64KB chunks
});

// 2. Attach a 'data' listener to start the flow
readStream.on('data', (chunk) => {
  console.log('--- NEW CHUNK RECEIVED ---');
  console.log(chunk);
});

// 3. Listen for the end of the stream
readStream.on('end', () => {
  console.log('Finished reading the entire file.');
});`,
  advancedTitle: "Real-World: Parsing Gigantic CSVs",
  advancedParagraphs: [
    <p key="1">
      Instead of our File Sync Engine, let's look at another highly common scenario: <strong>Data Engineering and Analytics</strong>.
    </p>,
    <p key="2">
      Imagine you work at an e-commerce company and you need to parse a 10GB CSV file containing 50 million sales records to calculate the total revenue. If you use <code>fs.readFileSync</code> and <code>String.split('\\n')</code>, the server will crash instantly.
    </p>,
    <p key="3">
      By using a Readable Stream, you can process the file chunk by chunk, incrementing a revenue counter as you go, while keeping your server's RAM usage permanently locked at around 64KB!
    </p>
  ],
  advancedExample: `const fs = require('fs');

function calculateTotalRevenue() {
  const readStream = fs.createReadStream('sales_data.csv', { encoding: 'utf8' });
  
  let totalRevenue = 0;
  let leftoverData = ''; // To handle rows split across chunks

  readStream.on('data', (chunk) => {
    // Combine any leftover data from the previous chunk
    const currentData = leftoverData + chunk;
    const lines = currentData.split('\\n');
    
    // Save the last line, because it might be incomplete!
    leftoverData = lines.pop();

    // Process all complete lines
    for (const line of lines) {
      if (line.trim() === '') continue;
      
      const columns = line.split(',');
      const price = parseFloat(columns[2]); // Assuming 3rd column is price
      
      if (!isNaN(price)) {
        totalRevenue += price;
      }
    }
  });

  readStream.on('end', () => {
    console.log(\`Total Revenue: $\${totalRevenue.toFixed(2)}\`);
    console.log('Processed 10GB file using almost 0 RAM!');
  });
}

calculateTotalRevenue();`
};
