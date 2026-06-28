const React = require('react');

const extractText = (node) => {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (node && node.props && node.props.children) {
      return extractText(node.props.children);
    }
    return '';
};

const paragraphs = [
    React.createElement('p', {key: "1"}, 
      "Before we dive into the depths of the V8 engine and the Event Loop, we need to understand how a Node.js project is actually constructed. Every modern JavaScript project revolves around a single file: ", 
      React.createElement('code', null, "package.json"),
      "."
    )
];

console.log(paragraphs.map(extractText));
