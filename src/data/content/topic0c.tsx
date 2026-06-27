import React from 'react';

export const topic0cContent = {
  description: "Executing your JavaScript code using the Node runtime.",
  difficulty: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
  paragraphs: [
    <p key="1">
      To run JavaScript in the browser, you attach it to an HTML file and open it in Chrome. To run JavaScript on your computer (server-side), you pass the file directly to the Node.js runtime executable.
    </p>,
    <p key="2">
      You do this by opening your terminal (command prompt), navigating to your project folder, and typing <code>node</code> followed by the name of the file you want to run.
    </p>,
    <p key="3">
      Node will read the file from top to bottom, execute the JavaScript, print any <code>console.log()</code> statements to your terminal window, and then automatically exit when there is no more code to run.
    </p>
  ],
  basicExample: `// 1. Create a file named 'hello.js'
console.log("Hello from the backend!");
const result = 5 * 5;
console.log("The result is: " + result);

// 2. Open your terminal and run:
// > node hello.js

// 3. You will see:
// Hello from the backend!
// The result is: 25`,
  advancedTitle: "Real-World: Process Arguments",
  advancedParagraphs: [
    <p key="1">
      In the real world, you often want to pass dynamic data to your script when you run it. For example, telling a script which port to start the server on, or which environment to run in (development vs production).
    </p>,
    <p key="2">
      You can pass arguments by typing them after the file name. Node.js makes these available inside your code via a global array called <code>process.argv</code>.
    </p>
  ],
  advancedExample: `// 1. Create a file named 'server.js'
const args = process.argv;

// process.argv[0] is the path to the Node executable
// process.argv[1] is the path to your script
// process.argv[2] is the FIRST argument you passed

const port = args[2] || 3000;
console.log(\`Starting server on port \${port}...\`);


// 2. Run it in your terminal:
// > node server.js 8080

// 3. You will see:
// Starting server on port 8080...`
};
