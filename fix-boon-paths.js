const fs = require('fs');

// Read the BoonSeeder file
const filePath = './BoonBuilder.API/Data/BoonSeeder.cs';
let content = fs.readFileSync(filePath, 'utf8');

// Map of incorrect paths to correct paths
const pathFixes = {
  // Apollo boons
  '/images/boons/core/c/cf/Nova_Flourish_Apollo.svg': '/images/boons/core/nova_flourish.svg',
  '/images/boons/core/2/22/Light_Smite_Apollo.svg': '/images/boons/core/lucid_ring.svg',
  '/images/boons/core/6/6b/Blinding_Sprint_Apollo.svg': '/images/boons/core/blinding_rush.svg',
  '/images/boons/core/d/db/Lucid_Gain_Apollo.svg': '/images/boons/core/solar_gain.svg',

  // Zeus boons
  '/images/boons/core/b/b1/Heaven_Strike_II.svg': '/images/boons/core/heaven_strike.svg',
  '/images/boons/core/e/e8/Heaven_Flourish_II.svg': '/images/boons/core/heaven_flourish.svg',
  '/images/boons/core/5/56/Storm_Ring_II.svg': '/images/boons/core/storm_ring.svg',
  '/images/boons/core/b/ba/Thunder_Rush_II.svg': '/images/boons/core/thunder_rush.svg',
  '/images/boons/core/1/15/Ionic_Gain_II.svg': '/images/boons/core/ionic_gain.svg',

  // Fix any remaining complex paths to simple placeholder names
  '/images/boons/core/e/e4/Vicious_Strike_Ares.svg': '/images/boons/core/vicious_strike.svg',
  '/images/boons/core/b/bd/Vicious_Flourish_Ares.svg': '/images/boons/core/vicious_flourish.svg',
  '/images/boons/core/1/1a/Blade_Rift_Ares.svg': '/images/boons/core/blade_rift.svg',
  '/images/boons/core/9/99/Battle_Sprint_Ares.svg': '/images/boons/core/battle_sprint.svg',
  '/images/boons/core/1/1e/Blood_Frenzy_Ares.svg': '/images/boons/core/blood_frenzy.svg',

  // Demeter boons
  '/images/boons/core/9/9f/Frost_Strike_Demeter.svg': '/images/boons/core/frost_strike.svg',
  '/images/boons/core/4/4d/Frost_Flourish_Demeter.svg': '/images/boons/core/frost_flourish.svg',
  '/images/boons/core/5/5c/Frozen_Touch_Demeter.svg': '/images/boons/core/frozen_touch.svg',
  '/images/boons/core/b/bb/Frigid_Sprint_Demeter.svg': '/images/boons/core/frigid_sprint.svg',
  '/images/boons/core/5/5e/Rare_Crop_Demeter.svg': '/images/boons/core/rare_crop.svg'
};

// Apply all fixes
console.log('🔧 Fixing boon image paths...');
let fixCount = 0;

for (const [oldPath, newPath] of Object.entries(pathFixes)) {
  if (content.includes(oldPath)) {
    content = content.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
    console.log(`✅ Fixed: ${oldPath} -> ${newPath}`);
    fixCount++;
  }
}

// Write the fixed content back
fs.writeFileSync(filePath, content);

console.log(`🎉 Fixed ${fixCount} boon image paths!`);
console.log('💡 All boon images now point to local SVG files');