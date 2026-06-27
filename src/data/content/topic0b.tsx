import React from 'react';

export const topic0bContent = {
  description: "Understanding how files talk to each other.",
  difficulty: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
  paragraphs: [
    <p key="1">
      Unlike the browser where every JavaScript file loaded via a <code>&lt;script&gt;</code> tag dumps its variables into the global window, Node.js uses a strict module system. Every file is isolated.
    </p>,
    <p key="2">
      Historically, Node.js used the <strong>CommonJS (CJS)</strong> module system. In CommonJS, you use <code>require()</code> to pull in code from other files, and <code>module.exports</code> to expose code.
    </p>,
    <p key="3">
      Recently, the JavaScript ecosystem has standardized on <strong>ES Modules (ESM)</strong>, which uses the <code>import</code> and <code>export</code> syntax. Node.js now fully supports ESM, but because of its history, you will see both syntaxes extensively in the wild.
    </p>
  ],
  basicExample: `// === CommonJS (The classic Node.js way) ===

// math.js
function add(a, b) { return a + b; }
module.exports = { add };

// index.js
const math = require('./math.js');
console.log(math.add(2, 2));`,
  advancedTitle: "Real-World: ES Modules",
  advancedParagraphs: [
    <p key="1">
      Modern frameworks (like React, Next.js, and Vite) almost exclusively use ES Modules. 
    </p>,
    <p key="2">
      To use ES Modules natively in Node.js, you simply need to add <code>"type": "module"</code> to your <code>package.json</code>, or name your files with the <code>.mjs</code> extension.
    </p>
  ],
  advancedExample: `// === ES Modules (The modern standard) ===

// math.js
export function add(a, b) { return a + b; }
export const PI = 3.14159;

// index.js
import { add, PI } from './math.js';
console.log(add(PI, 2));`
};
