const fs = require('fs');

// Read the BoonSeeder file
const filePath = './BoonBuilder.API/Data/BoonSeeder.cs';
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔧 Fixing weapon image paths...');

// Replace weapon paths with simple names
const weaponFixes = {
  // Basic weapons
  '/images/weapons/4/4f/Hammer_Staff_Melino%C3%AB.svg': '/images/weapons/witch_staff.svg',
  '/images/weapons/1/1d/Hammer_Daggers_Melino%C3%AB_II.svg': '/images/weapons/sister_blades.svg',
  '/images/weapons/5/53/Hammer_Torch_Melino%C3%AB.svg': '/images/weapons/umbral_flames.svg',
  '/images/weapons/e/ea/Hammer_Axe_Melino%C3%AB.svg': '/images/weapons/moonstone_axe.svg',
  '/images/weapons/a/a5/Aspect_of_Melino%C3%AB_II.svg': '/images/weapons/argent_skull.svg',
  '/images/weapons/5/56/Coat_Melino%C3%AB.svg': '/images/weapons/black_coat.svg',

  // Weapon aspects - convert to /images/aspects/
  '/images/weapons/9/95/Hammer_Staff_Circe.svg': '/images/aspects/aspect_circe.svg',
  '/images/weapons/5/54/Hammer_Staff_Momus.svg': '/images/aspects/aspect_momus.svg',
  '/images/weapons/3/33/Aspect_of_Artemis_II.svg': '/images/aspects/aspect_artemis.svg',
  '/images/weapons/f/f4/Aspect_of_Pan_II.svg': '/images/aspects/aspect_pan.svg',
  '/images/weapons/a/ad/Hammer_Torch_Moros.svg': '/images/aspects/aspect_moros.svg',
  '/images/weapons/4/45/Hammer_Torch_Eos.svg': '/images/aspects/aspect_eos.svg',
  '/images/weapons/c/cc/HammerTorch_42.svg': '/images/aspects/aspect_supay.svg',
  '/images/weapons/d/d4/Hammer_Axe_Charon.svg': '/images/aspects/aspect_charon.svg',
  '/images/weapons/7/7d/Hammer_Axe_Thanatos.svg': '/images/aspects/aspect_thanatos.svg',
  '/images/weapons/2/2a/HammerAxe_43.svg': '/images/aspects/aspect_nergal.svg',
  '/images/weapons/7/74/Aspect_of_Medea_II.svg': '/images/aspects/aspect_medea.svg',
  '/images/weapons/f/f8/Aspect_of_Persephone_II.svg': '/images/aspects/aspect_persephone.svg',
  '/images/weapons/b/bf/HammerLob_16.svg': '/images/aspects/aspect_hel.svg',
  '/images/weapons/3/35/Coat_Selene.svg': '/images/aspects/aspect_selene.svg',
  '/images/weapons/5/57/Coat_Nyx.svg': '/images/aspects/aspect_nyx.svg',
  '/images/weapons/d/dc/HammerSuit_16.svg': '/images/aspects/aspect_shiva.svg'
};

// Apply fixes
let fixCount = 0;
for (const [oldPath, newPath] of Object.entries(weaponFixes)) {
  if (content.includes(oldPath)) {
    content = content.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
    console.log(`✅ Fixed: ${oldPath} -> ${newPath}`);
    fixCount++;
  }
}

// Fix remaining complex weapon paths to simple placeholders
content = content.replace(/\/images\/weapons\/[^"]+"/g, (match) => {
  // If it's already a simple path, leave it
  if (match.includes('/images/weapons/') && !match.includes('/')) {
    return match;
  }

  // Convert complex paths to simple placeholders
  if (match.includes('Hammer_Staff')) return '"/images/weapons/witch_staff.svg"';
  if (match.includes('Hammer_Daggers')) return '"/images/weapons/sister_blades.svg"';
  if (match.includes('Hammer_Torch')) return '"/images/weapons/umbral_flames.svg"';
  if (match.includes('Hammer_Axe')) return '"/images/weapons/moonstone_axe.svg"';
  if (match.includes('Aspect_of_Melino')) return '"/images/weapons/argent_skull.svg"';
  if (match.includes('Coat')) return '"/images/weapons/black_coat.svg"';

  return '"/images/weapons/placeholder.svg"';
});

// Fix any remaining complex aspect paths
content = content.replace(/\/images\/aspects\/[^"]+"/g, (match) => {
  // If it's already a simple aspect path, leave it
  if (match.match(/\/images\/aspects\/aspect_\w+\.svg"/)) {
    return match;
  }

  return '"/images/aspects/aspect_placeholder.svg"';
});

// Write the fixed content back
fs.writeFileSync(filePath, content);

console.log(`🎉 Fixed ${fixCount} weapon image paths!`);
console.log('💡 All weapons now use local SVG files');