const fs = require('fs');
const path = require('path');

// Create placeholder weapon images
function createPlaceholder(filepath, name) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#8B5CF6"/>
    <text x="100" y="100" fill="white" text-anchor="middle" dominant-baseline="central" font-family="Arial" font-size="12">${name}</text>
  </svg>`;

  fs.writeFileSync(filepath, svg);
  console.log(`🔸 Created weapon placeholder: ${path.basename(filepath)}`);
}

// Create weapon placeholders
const weaponDir = './boonbuilder-frontend/public/images/weapons';
const aspectDir = './boonbuilder-frontend/public/images/aspects';

// Ensure directories exist
[weaponDir, aspectDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Basic weapon placeholders
const weapons = [
  'witch_staff',
  'sister_blades',
  'umbral_flames',
  'moonstone_axe',
  'argent_skull',
  'black_coat'
];

weapons.forEach(weapon => {
  const filepath = path.join(weaponDir, `${weapon}.svg`);
  createPlaceholder(filepath, weapon.replace(/_/g, ' '));
});

// Basic aspect placeholders
const aspects = [
  'melinoe',
  'circe',
  'momus',
  'artemis',
  'pan',
  'moros',
  'eos',
  'supay',
  'charon',
  'thanatos',
  'nergal',
  'medea',
  'persephone',
  'hel',
  'selene',
  'nyx',
  'shiva'
];

aspects.forEach(aspect => {
  const filepath = path.join(aspectDir, `aspect_${aspect}.svg`);
  createPlaceholder(filepath, `Aspect of ${aspect}`);
});

console.log('🎉 All weapon and aspect placeholders created!');