const fs = require('fs');
let content = fs.readFileSync('src/data/topics.ts', 'utf8');

for (let i = 25; i <= 40; i++) {
  // We want to match: "difficulty": "...", and then \n    ...topicXContent
  const regex = new RegExp('"difficulty":\\s*"[^"]+",\\s*\\.\\.\\.topic' + i + 'Content', 'g');
  content = content.replace(regex, '...topic' + i + 'Content');
}

fs.writeFileSync('src/data/topics.ts', content);
console.log('Fixed duplicates in topics.ts');
