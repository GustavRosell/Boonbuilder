const fs = require('fs');

// Read the BoonSeeder file
const filePath = './BoonBuilder.API/Data/BoonSeeder.cs';
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔧 Converting all complex image paths to simple placeholder names...');

// Use regex to find and replace all complex paths with simple boon names
content = content.replace(/IconUrl = "\/images\/boons\/core\/[^"]+"/g, (match) => {
  // Extract the boon name from the surrounding context
  const lines = content.split('\n');
  const lineIndex = content.substring(0, content.indexOf(match)).split('\n').length - 1;
  const currentLine = lines[lineIndex];

  // Extract boon name from the line
  const nameMatch = currentLine.match(/Name = "([^"]+)"/);
  if (nameMatch) {
    const boonName = nameMatch[1]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    return `IconUrl = "/images/boons/core/${boonName}.svg"`;
  }

  return match;
});

// Fix duo boons paths
content = content.replace(/IconUrl = "\/images\/boons\/core\/.*?Island_Getaway.*?"/g, 'IconUrl = "/images/boons/duo/island_getaway.svg"');
content = content.replace(/IconUrl = "\/images\/boons\/core\/.*?Romantic_Spark.*?"/g, 'IconUrl = "/images/boons/duo/romantic_spark.svg"');
content = content.replace(/IconUrl = "\/images\/boons\/core\/.*?Beach_Ball.*?"/g, 'IconUrl = "/images/boons/duo/beach_ball.svg"');
content = content.replace(/IconUrl = "\/images\/boons\/core\/.*?Glorious_Disaster.*?"/g, 'IconUrl = "/images/boons/duo/glorious_disaster.svg"');

// Fix legendary boons paths
content = content.replace(/IconUrl = "\/images\/boons\/core\/.*?King_Tide.*?"/g, 'IconUrl = "/images/boons/legendary/king_tide.svg"');
content = content.replace(/IconUrl = "\/images\/boons\/core\/.*?Shocking_Loss.*?"/g, 'IconUrl = "/images/boons/legendary/shocking_loss.svg"');

// Write the fixed content back
fs.writeFileSync(filePath, content);

console.log('🎉 All image paths have been converted to simple, consistent format!');
console.log('💡 All boons now use format: /images/boons/{type}/{boon_name}.svg');