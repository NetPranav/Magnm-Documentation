const fs = require('fs');

const files = [
  'src/data/content/topic6.tsx',
  'src/data/content/topic12.tsx',
  'src/data/content/topic18.tsx',
  'src/data/content/topic24.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find where `code: \`` starts
  const codeIndex = content.indexOf('code: `');
  if (codeIndex === -1) continue;
  
  const startIdx = codeIndex + 6; // index of the opening backtick
  const endIdx = content.lastIndexOf('`'); // assuming the closing backtick is the last one in the file before `  }\n};`
  
  if (endIdx === -1 || endIdx <= startIdx) continue;
  
  let codeStr = content.substring(startIdx + 1, endIdx);
  
  // Replace the messed up backslashes if any
  codeStr = codeStr.replace(/\\\\\\`/g, '`');
  codeStr = codeStr.replace(/\\\\\\$/g, '$');
  
  // Now stringify it so it uses double quotes and proper escaping
  const safeCodeStr = JSON.stringify(codeStr);
  
  content = content.substring(0, startIdx) + safeCodeStr + content.substring(endIdx + 1);
  
  fs.writeFileSync(file, content);
  console.log(`Fixed ${file}`);
}
