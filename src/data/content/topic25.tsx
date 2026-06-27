import React from 'react';

export const topic25Content = {
  description: "The lowest-level networking module in Node.js.",
  difficulty: "Advanced" as const,
  paragraphs: [
    <p key="1">
      When you use a web browser to visit a website, or an app to fetch data, there is a complex series of negotiations happening beneath the surface. The foundation of almost all internet communication is <strong>TCP (Transmission Control Protocol)</strong>.
    </p>,
    <p key="2">
      The Node.js <code>net</code> module gives you direct, low-level access to TCP. It allows you to create raw network sockets to send and receive binary data over the internet, completely bypassing higher-level protocols like HTTP.
    </p>,
    <p key="3">
      While you usually won't build web servers with <code>net</code> (you'd use the <code>http</code> module for that), understanding it is critical because <em>every single network module in Node.js</em> (HTTP, WebSockets, gRPC, database drivers) is built on top of the <code>net</code> module!
    </p>
  ],
  basicExample: `// 1. Import the net module
const net = require('net');

// 2. Connect to an existing TCP server (e.g. Google's web server on port 80)
const client = net.createConnection({ port: 80, host: 'google.com' }, () => {
  console.log('Connected to Google via raw TCP!');
  
  // 3. Send raw data over the socket
  client.write('GET / HTTP/1.1\\r\\n');
  client.write('Host: google.com\\r\\n');
  client.write('\\r\\n'); // Blank line indicates end of request
});

// 4. Listen for raw binary data coming back
client.on('data', (data) => {
  console.log(data.toString());
  client.end(); // Close the connection
});`,
  advancedTitle: "Real-World: Custom Database Driver",
  advancedParagraphs: [
    <p key="1">
      When you install a library like <code>pg</code> to connect to PostgreSQL, or <code>mongodb</code> to connect to Mongo, how do they actually talk to the database?
    </p>,
    <p key="2">
      Databases do not use HTTP! They have their own custom binary protocols built directly on top of TCP for maximum speed. Database drivers use the <code>net</code> module to establish a persistent, stateful TCP connection to the database server, and send custom-formatted Buffer streams back and forth.
    </p>
  ],
  advancedExample: `// A simplified visualization of a database driver
const net = require('net');

class SimpleDBDriver {
  constructor(host, port) {
    this.client = net.createConnection({ port, host });
    
    this.client.on('data', (data) => {
      // The database sends back binary data which we must decode
      console.log("Database Response:", data.toString());
    });
  }

  query(sqlString) {
    // We send a custom payload over the TCP connection
    const payload = Buffer.from(\`QUERY:\\\${sqlString}\`);
    this.client.write(payload);
  }
}

// const db = new SimpleDBDriver('localhost', 5432);
// db.query('SELECT * FROM users');`
};
