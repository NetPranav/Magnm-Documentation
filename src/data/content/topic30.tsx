import React from 'react';

export const topic30Content = {
  description: "Making HTTP requests from your server to other servers.",
  difficulty: "Beginner" as const,
  paragraphs: [
    <p key="1">
      Up until now, our Node.js server has been the one <em>receiving</em> requests. But often, your server needs to act as a <em>client</em> and fetch data from other servers (like querying the Stripe API, fetching weather data, or sending an SMS via Twilio).
    </p>,
    <p key="2">
      In modern Node.js (v18+), the global <strong><code>fetch()</code></strong> API is built directly into the runtime! This is the exact same <code>fetch()</code> API you use in the browser, meaning you don't need to learn a new syntax or install third-party libraries like <code>axios</code> just to make basic HTTP requests.
    </p>,
    <p key="3">
      Because network requests are slow and unpredictable, <code>fetch()</code> is heavily heavily asynchronous and relies on Promises. You will almost always use it alongside <code>async/await</code> so you don't block the Event Loop while waiting for the remote server to respond.
    </p>
  ],
  basicExample: `// Fetching data from a public API using the native fetch()
async function getPokeData() {
  try {
    // 1. Send the HTTP GET request
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu');
    
    // 2. Check if the server responded with a success status code (200-299)
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    // 3. Parse the JSON body from the response stream
    const data = await response.json();
    
    console.log(\`Name: \${data.name}, Weight: \${data.weight}\`);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

getPokeData();`,
  advancedTitle: "Real-World: Creating a Proxy Route",
  advancedParagraphs: [
    <p key="1">
      Why not just have the browser <code>fetch()</code> the external API directly? Why do we need the Node.js server in the middle?
    </p>,
    <p key="2">
      <strong>Security.</strong> If you are using a paid API (like OpenAI or Stripe), you have a secret API Key. If you put that key in your React/Browser code, anyone can open the DevTools, steal your key, and run up a $10,000 bill on your account!
    </p>,
    <p key="3">
      Instead, you build a <strong>Proxy Route</strong> on your Node.js server. The browser securely asks your server for data. Your server attaches the secret API key, makes the <code>fetch()</code> request to the external API, gets the result, and passes it back to the browser. The secret key never leaves your server!
    </p>
  ],
  advancedExample: `const http = require('http');

const server = http.createServer(async (req, res) => {
  // We expose a safe route to our frontend
  if (req.url === '/api/get-weather') {
    
    // 1. Keep the secret key safely on the backend!
    const SECRET_API_KEY = "super_secret_12345";
    
    try {
      // 2. The backend makes the secure request
      const weatherRes = await fetch(\`https://api.weather.com/v1?key=\${SECRET_API_KEY}\`);
      const weatherData = await weatherRes.json();
      
      // 3. Send the final data back to the browser
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(weatherData));
      
    } catch (err) {
      res.writeHead(500);
      res.end("Server Error");
    }
  }
});

// server.listen(3000);`,
  miniProject: {
    title: "The Crypto Price Proxy",
    description: (
      <>
        <p>
          <strong>Goal:</strong> Build an HTTP server that exposes a <code>/api/bitcoin</code> route. When a user visits this route, your server should fetch the current Bitcoin price from a public API and return it as JSON.
        </p>
        <p>
          Use the built-in <code>http</code> module to create the server. Inside the request handler, use the native <code>fetch()</code> function to call <code>https://api.coindesk.com/v1/bpi/currentprice.json</code>. Parse the JSON response, extract just the USD price (<code>data.bpi.USD.rate</code>), and send it back to the client.
        </p>
      </>
    ),
    code: `const http = require('http');

const server = http.createServer(async (req, res) => {
  if (req.url === '/api/bitcoin') {
    try {
      // 1. Fetch from the external API
      const apiResponse = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
      const data = await apiResponse.json();
      
      // 2. Extract just the piece of data we want
      const usdPrice = data.bpi.USD.rate;
      
      // 3. Send our custom JSON back to the client
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        asset: "Bitcoin",
        price_usd: usdPrice
      }));
      
    } catch (error) {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "Failed to fetch crypto prices" }));
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log("Crypto Proxy running! Visit http://localhost:3000/api/bitcoin");
});`
  },
  quiz: {
    title: "Module V: Networking & WebSockets Quiz",
    questions: [
      {
        question: "What is the difference between the `net` module and the `http` module?",
        options: [
          "`net` handles HTTP, `http` handles HTTPS",
          "`net` provides raw TCP sockets without HTTP headers, `http` adds the HTTP protocol on top of `net`",
          "`net` is used for frontend, `http` is used for backend",
          "There is no difference"
        ],
        correctAnswerIndex: 1,
        explanation: "The `net` module deals with pure, raw TCP streams. The `http` module extends those streams by automatically parsing standard HTTP headers and body formats."
      },
      {
        question: "What is a core advantage of WebSockets over traditional HTTP Polling?",
        options: [
          "WebSockets are more secure",
          "WebSockets keep a persistent, bi-directional TCP connection open, avoiding the massive overhead of sending HTTP headers on every message",
          "WebSockets work natively in PHP",
          "WebSockets compress data automatically"
        ],
        correctAnswerIndex: 1,
        explanation: "HTTP polling requires opening a new connection and sending large HTTP headers every second. WebSockets open one connection and leave it open, allowing tiny messages to be sent instantly."
      },
      {
        question: "How does a WebSocket connection begin?",
        options: [
          "With an FTP request",
          "With a standard HTTP GET request containing an 'Upgrade' header",
          "With a UDP ping",
          "With a raw TCP packet"
        ],
        correctAnswerIndex: 1,
        explanation: "WebSockets start their life as a standard HTTP request. If the server supports WebSockets, it responds with an HTTP 101 Switching Protocols code and upgrades the TCP socket."
      },
      {
        question: "Why might you build a proxy server that connects to an external API instead of having the browser call the API directly?",
        options: [
          "To securely hide API keys on the backend",
          "To implement caching and rate-limiting",
          "To bypass CORS restrictions",
          "All of the above"
        ],
        correctAnswerIndex: 3,
        explanation: "A backend proxy server hides your secret API keys from the browser, allows you to cache responses to save money, and completely bypasses CORS restrictions."
      }
    ]
  }
};
