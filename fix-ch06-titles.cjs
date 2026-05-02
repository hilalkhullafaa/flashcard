const fs = require('fs');

console.log('Fixing Chapter 6 conversation titles...');

const ch06 = JSON.parse(fs.readFileSync('data/ch06.json', 'utf8'));

// Fix all conversation titles - replace em dash with regular dash
ch06.conversations.forEach((conv, index) => {
  if (conv.title.includes('—')) {
    const oldTitle = conv.title;
    conv.title = conv.title.replace(/—/g, '-');
    console.log(`✓ Fixed conversation ${index + 1}: "${oldTitle}" → "${conv.title}"`);
  }
});

fs.writeFileSync('data/ch06.json', JSON.stringify(ch06, null, 2), 'utf8');
console.log('\n✓ Saved ch06.json');
console.log('All conversation titles fixed!');
