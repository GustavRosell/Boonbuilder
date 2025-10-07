const fs = require('fs');
const path = require('path');

// Paths
const seederPath = './BoonBuilder.API/Data/BoonSeeder.cs';
const publicPath = './boonbuilder-frontend/public';

// Read BoonSeeder.cs
const seederContent = fs.readFileSync(seederPath, 'utf-8');

// Extract all IconUrl values using regex
const iconUrlRegex = /IconUrl\s*=\s*"([^"]+)"/g;
const matches = [...seederContent.matchAll(iconUrlRegex)];
const iconUrls = matches.map(m => m[1]);

// Group by category
const categories = {
  gods: [],
  boons: [],
  aspects: [],
  familiars: [],
  weapons: [],
  other: []
};

iconUrls.forEach(url => {
  if (url.includes('/gods/')) categories.gods.push(url);
  else if (url.includes('/boons/')) categories.boons.push(url);
  else if (url.includes('/aspects/')) categories.aspects.push(url);
  else if (url.includes('/familiars/')) categories.familiars.push(url);
  else if (url.includes('/weapons/')) categories.weapons.push(url);
  else categories.other.push(url);
});

// Check if files exist
function checkFile(iconUrl) {
  const filePath = path.join(publicPath, iconUrl);
  const exists = fs.existsSync(filePath);

  // Try .svg fallback if .webp doesn't exist
  let fallbackExists = false;
  if (!exists && iconUrl.endsWith('.webp')) {
    const svgPath = path.join(publicPath, iconUrl.replace('.webp', '.svg'));
    fallbackExists = fs.existsSync(svgPath);
  }

  return { exists, fallbackExists, path: filePath };
}

// Generate report
console.log('\n═══════════════════════════════════════════════════════');
console.log('           IMAGE VERIFICATION REPORT');
console.log('═══════════════════════════════════════════════════════\n');

let totalImages = 0;
let existingImages = 0;
let missingImages = 0;

Object.entries(categories).forEach(([category, urls]) => {
  if (urls.length === 0) return;

  console.log(`\n📁 ${category.toUpperCase()} (${urls.length} images)`);
  console.log('─'.repeat(55));

  const uniqueUrls = [...new Set(urls)]; // Remove duplicates

  uniqueUrls.forEach(url => {
    totalImages++;
    const { exists, fallbackExists, path: filePath } = checkFile(url);

    if (exists) {
      console.log(`✓ ${url}`);
      existingImages++;
    } else if (fallbackExists) {
      console.log(`⚠ ${url} (using .svg fallback)`);
      existingImages++;
    } else {
      console.log(`✗ ${url} - MISSING`);
      missingImages++;
    }
  });
});

// Summary
console.log('\n═══════════════════════════════════════════════════════');
console.log('                    SUMMARY');
console.log('═══════════════════════════════════════════════════════');
console.log(`Total images referenced: ${totalImages}`);
console.log(`✓ Existing: ${existingImages} (${Math.round(existingImages/totalImages*100)}%)`);
console.log(`✗ Missing: ${missingImages} (${Math.round(missingImages/totalImages*100)}%)`);
console.log('═══════════════════════════════════════════════════════\n');

// Missing images list
if (missingImages > 0) {
  console.log('\n⚠️  MISSING IMAGES TO ADD:\n');
  Object.entries(categories).forEach(([category, urls]) => {
    const uniqueUrls = [...new Set(urls)];
    const missing = uniqueUrls.filter(url => !checkFile(url).exists && !checkFile(url).fallbackExists);
    if (missing.length > 0) {
      console.log(`${category}:`);
      missing.forEach(url => console.log(`  - ${url}`));
    }
  });
}

// Instructions
console.log('\n📋 HOW TO VIEW IMAGES:');
console.log('─'.repeat(55));
console.log('1. Open boonbuilder-frontend/public/images/ folder');
console.log('2. Navigate to subdirectory (gods, boons/core, etc.)');
console.log('3. Double-click image files to verify they\'re correct');
console.log('');
console.log('📝 HOW TO UPDATE IMAGE PATHS:');
console.log('─'.repeat(55));
console.log('1. Edit BoonBuilder.API/Data/BoonSeeder.cs');
console.log('2. Find the boon/god/weapon entry');
console.log('3. Update the IconUrl = "/images/..." path');
console.log('4. Delete boonbuilder.db and restart API to reload\n');
