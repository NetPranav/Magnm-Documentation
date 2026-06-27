const fs = require('fs');

const path = './src/data/topics.ts';
let content = fs.readFileSync(path, 'utf8');

const tags = {
  1: 'Beginner', 2: 'Advanced', 3: 'Intermediate', 4: 'Intermediate',
  5: 'Beginner', 6: 'Intermediate', 7: 'Beginner', 8: 'Beginner',
  9: 'Intermediate', 10: 'Intermediate', 11: 'Advanced', 12: 'Intermediate',
  13: 'Beginner', 14: 'Beginner', 15: 'Advanced', 16: 'Intermediate',
  17: 'Advanced', 18: 'Intermediate', 19: 'Beginner', 20: 'Intermediate',
  21: 'Advanced', 22: 'Advanced', 23: 'Advanced', 24: 'Intermediate',
};

for (let i = 1; i <= 24; i++) {
  const difficulty = tags[i] || 'Intermediate';
  
  // Find "id": i, and the following lines up to "section": "..."
  const searchPattern = new RegExp('("id":\\s*' + i + ',\\s*"slug":\\s*"[^"]+",\\s*"title":\\s*"[^"]+",\\s*"shortTitle":\\s*"[^"]+",\\s*"section":\\s*"[^"]+")', 'g');
  
  content = content.replace(searchPattern, '$1,\n    "difficulty": "' + difficulty + '"');
}

fs.writeFileSync(path, content);
console.log('Done!');
