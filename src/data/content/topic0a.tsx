import React from 'react';

export const topic0aContent = {
  description: "The heart of every Node.js project.",
  difficulty: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
  paragraphs: [
    <p key="1">
      Before we dive into the depths of the V8 engine and the Event Loop, we need to understand how a Node.js project is actually constructed. Every modern JavaScript project revolves around a single file: <code>package.json</code>.
    </p>,
    <p key="2">
      This file serves as the manifest for your project. It records the project's name, version, entry point, and most importantly, its <strong>dependencies</strong>. When you run a command like <code>npm install express</code>, Node Package Manager (NPM) downloads the Express code from the internet into a folder called <code>node_modules</code>, and writes a record of this into your <code>package.json</code>.
    </p>,
    <p key="3">
      This means you never have to share the massive <code>node_modules</code> folder with your teammates. You simply share the tiny <code>package.json</code> file, and they can run <code>npm install</code> to instantly download exactly the same dependencies you were using.
    </p>
  ],
  basicExample: `{
  "name": "my-awesome-app",
  "version": "1.0.0",
  "description": "A basic Node.js application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}`,
  advancedTitle: "Real-World: NPM Scripts",
  advancedParagraphs: [
    <p key="1">
      In the real world, you rarely type out long terminal commands manually. Instead, you define them in the <code>"scripts"</code> section of your <code>package.json</code>.
    </p>,
    <p key="2">
      This allows you to create aliases. For example, typing <code>npm run dev</code> will look inside your <code>package.json</code>, find the "dev" script, and execute <code>nodemon index.js</code> on your behalf.
    </p>
  ],
  advancedExample: `// If you open your terminal and type:
// > npm run build

// NPM will look at this package.json:
{
  "scripts": {
    // And it will execute this exact command automatically!
    "build": "tsc && vite build && echo 'Build complete!'"
  }
}`
};
