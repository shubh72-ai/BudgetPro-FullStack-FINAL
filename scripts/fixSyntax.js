const fs = require('fs');
const path = require('path');

const filesToFix = [
  path.join(__dirname, '../src/WhiteHomePage.jsx'),
  path.join(__dirname, '../src/WhiteSaaSHero.jsx')
];

filesToFix.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace \` with `
  content = content.replace(/\\`/g, '`');
  // Replace \$ with $
  content = content.replace(/\\\$/g, '$');
  
  fs.writeFileSync(file, content, 'utf8');
});
console.log("Fixed syntax errors!");
