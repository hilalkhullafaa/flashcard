import { readFileSync } from 'fs';

const data = JSON.parse(readFileSync('./data/ch06.json', 'utf-8'));
const categories = {};

data.quiz.forEach(q => {
  categories[q.category] = (categories[q.category] || 0) + 1;
});

console.log('Chapter 6 Quiz Distribution:');
Object.entries(categories).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});
console.log(`  Total: ${data.quiz.length}`);
