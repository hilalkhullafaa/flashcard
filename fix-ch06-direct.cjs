const fs = require('fs');

console.log('🔧 Fixing Chapter 6 corruption directly\n');

const filePath = 'data/ch06.json';
let content = fs.readFileSync(filePath, 'utf8');

console.log('Before fixes:');
console.log('- Title contains "??":', content.includes('?? 6??'));
console.log('- Grammar contains "ã‚\'":', content.includes('ã‚\''));
console.log('- Grammar contains "â€"":', content.includes('â€"'));

// Fix chapter title
content = content.replace('"title": "?? 6??に 起きま?"', '"title": "毎朝 6時に 起きます"');

// Fix particle を
content = content.replace(/ã‚'/g, 'を');

// Fix em dash
content = content.replace(/â€"/g, '—');

// Fix other common patterns
content = content.replace(/ã€œ/g, '〜');
content = content.replace(/æœˆ/g, '月');

fs.writeFileSync(filePath, content, 'utf8');

console.log('\nAfter fixes:');
const fixed = fs.readFileSync(filePath, 'utf8');
console.log('- Title contains "??":', fixed.includes('?? 6??'));
console.log('- Grammar contains "ã‚\'":', fixed.includes('ã‚\''));
console.log('- Grammar contains "â€"":', fixed.includes('â€"'));

console.log('\n✅ Chapter 6 fixed!');
