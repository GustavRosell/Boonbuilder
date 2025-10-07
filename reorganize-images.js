const fs = require('fs');
const path = require('path');

// Configuration
const publicDir = './boonbuilder-frontend/public/images';
const newStructureDir = './boonbuilder-frontend/public/images_new';

// New structure mapping
const newStructure = {
  // Gods remain at top level
  gods: ['aphrodite', 'apollo', 'ares', 'demeter', 'hephaestus', 'hera', 'hestia', 'poseidon', 'zeus'],

  // Boons organized by god
  boons: {
    aphrodite: {
      core: ['flutter_strike', 'flutter_flourish', 'rapture_ring', 'passion_rush', 'glamour_gain'],
      legendary: ['passion_flare'],
      other: []
    },
    apollo: {
      core: ['nova_strike', 'nova_flourish', 'solar_ring', 'blinding_sprint', 'lucid_gain'],
      legendary: ['perfect_shot'],
      other: []
    },
    ares: {
      core: ['vicious_strike', 'vicious_flourish', 'blade_rift', 'battle_sprint', 'blood_frenzy'],
      legendary: ['unending_stamina'],
      other: []
    },
    demeter: {
      core: ['frost_strike', 'frost_flourish', 'frozen_touch', 'frigid_sprint', 'rare_crop'],
      legendary: ['winter_harvest'],
      other: []
    },
    hephaestus: {
      core: ['volcanic_strike', 'volcanic_flourish', 'molten_touch', 'forge_sprint', 'smoldering_air'],
      legendary: ['volcanic_ash'],
      other: []
    },
    hera: {
      core: ['nexus_strike', 'nexus_flourish', 'engagement_ring', 'nexus_sprint', 'greater_recall'],
      legendary: ['all_together'],
      other: []
    },
    hestia: {
      core: ['flame_strike', 'flame_flourish', 'hearth_gain', 'soot_sprint', 'controlled_burn'],
      legendary: ['fire_away'],
      other: []
    },
    poseidon: {
      core: ['wave_strike', 'wave_flourish', 'tidal_ring', 'breaker_sprint', 'flood_gain'],
      legendary: ['king_tide'],
      other: []
    },
    zeus: {
      core: ['heaven_strike', 'heaven_flourish', 'storm_ring', 'thunder_rush', 'ionic_gain'],
      legendary: ['shocking_loss'],
      other: []
    },
    duo: [
      'burning_desire', 'carnal_pleasure', 'ecstatic_obsession', 'hearty_appetite',
      'island_getaway', 'love_handles', 'romantic_spark', 'sunny_disposition',
      'beach_ball', 'cutting_edge', 'glorious_disaster', 'rude_awakening',
      'sun_worshiper', 'tropical_cyclone', 'warm_breeze', 'torrential_downpour'
    ]
  },

  // Weapons with aspects
  weapons: {
    witch_staff: {
      base: 'witch_staff',
      aspects: ['aspect_melinoe', 'aspect_circe', 'aspect_momus']
    },
    sister_blades: {
      base: 'sister_blades',
      aspects: ['aspect_melinoe', 'aspect_artemis', 'aspect_pan']
    },
    umbral_flames: {
      base: 'umbral_flames',
      aspects: ['aspect_melinoe', 'aspect_moros', 'aspect_eos', 'aspect_supay']
    },
    moonstone_axe: {
      base: 'moonstone_axe',
      aspects: ['aspect_melinoe', 'aspect_charon', 'aspect_thanatos', 'aspect_nergal']
    },
    argent_skull: {
      base: 'argent_skull',
      aspects: ['aspect_melinoe', 'aspect_medea', 'aspect_persephone', 'aspect_hel']
    },
    black_coat: {
      base: 'black_coat',
      aspects: ['aspect_melinoe', 'aspect_selene', 'aspect_nyx', 'aspect_shiva']
    }
  },

  // Familiars
  familiars: ['frinos', 'gale', 'hecuba', 'raki', 'toula']
};

// Create new directory structure
function createNewStructure() {
  console.log('📁 Creating new directory structure...\n');

  // Create base directories
  const dirs = [
    `${newStructureDir}/gods`,
    `${newStructureDir}/boons/duo`,
    `${newStructureDir}/familiars`
  ];

  // Create boon directories for each god
  newStructure.gods.forEach(god => {
    dirs.push(`${newStructureDir}/boons/${god}/core`);
    dirs.push(`${newStructureDir}/boons/${god}/legendary`);
    dirs.push(`${newStructureDir}/boons/${god}/other`);
  });

  // Create weapon directories
  Object.keys(newStructure.weapons).forEach(weapon => {
    dirs.push(`${newStructureDir}/weapons/${weapon}`);
  });

  dirs.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created: ${dir}`);
  });
}

// Copy existing files to new structure
function migrateFiles() {
  console.log('\n📦 Migrating existing files...\n');

  let copied = 0;
  let missing = 0;

  // Migrate gods
  console.log('Gods:');
  newStructure.gods.forEach(god => {
    const oldPath = `${publicDir}/gods/${god}.webp`;
    const newPath = `${newStructureDir}/gods/${god}.webp`;
    if (fs.existsSync(oldPath)) {
      fs.copyFileSync(oldPath, newPath);
      console.log(`  ✓ ${god}.webp`);
      copied++;
    } else {
      console.log(`  ✗ ${god}.webp - MISSING`);
      missing++;
    }
  });

  // Migrate boons
  console.log('\nBoons:');
  Object.entries(newStructure.boons).forEach(([god, types]) => {
    if (god === 'duo') {
      // Handle duo boons separately
      types.forEach(boon => {
        const oldPath = `${publicDir}/boons/duo/${boon}.webp`;
        const newPath = `${newStructureDir}/boons/duo/${boon}.webp`;
        if (fs.existsSync(oldPath)) {
          fs.copyFileSync(oldPath, newPath);
          console.log(`  ✓ duo/${boon}.webp`);
          copied++;
        } else {
          console.log(`  ✗ duo/${boon}.webp - MISSING`);
          missing++;
        }
      });
    } else {
      // Handle god-specific boons
      Object.entries(types).forEach(([type, boons]) => {
        boons.forEach(boon => {
          const oldPaths = [
            `${publicDir}/boons/${type}/${boon}.webp`,
            `${publicDir}/boons/${type}/${boon}.svg`
          ];

          let found = false;
          for (const oldPath of oldPaths) {
            if (fs.existsSync(oldPath)) {
              const ext = path.extname(oldPath);
              const newPath = `${newStructureDir}/boons/${god}/${type}/${boon}${ext}`;
              fs.copyFileSync(oldPath, newPath);
              console.log(`  ✓ ${god}/${type}/${boon}${ext}`);
              copied++;
              found = true;
              break;
            }
          }

          if (!found) {
            console.log(`  ✗ ${god}/${type}/${boon} - MISSING`);
            missing++;
          }
        });
      });
    }
  });

  // Migrate weapons and aspects
  console.log('\nWeapons:');
  Object.entries(newStructure.weapons).forEach(([weapon, data]) => {
    // Copy weapon base image
    const weaponOldPath = `${publicDir}/weapons/${data.base}.svg`;
    const weaponNewPath = `${newStructureDir}/weapons/${weapon}/base.svg`;
    if (fs.existsSync(weaponOldPath)) {
      fs.copyFileSync(weaponOldPath, weaponNewPath);
      console.log(`  ✓ ${weapon}/base.svg`);
      copied++;
    } else {
      console.log(`  ✗ ${weapon}/base.svg - MISSING`);
      missing++;
    }

    // Copy aspects
    data.aspects.forEach(aspect => {
      const aspectOldPath = `${publicDir}/aspects/${aspect}.svg`;
      const aspectNewPath = `${newStructureDir}/weapons/${weapon}/${aspect}.svg`;
      if (fs.existsSync(aspectOldPath)) {
        fs.copyFileSync(aspectOldPath, aspectNewPath);
        console.log(`  ✓ ${weapon}/${aspect}.svg`);
        copied++;
      } else {
        // Also check .webp
        const aspectOldPathWebp = `${publicDir}/aspects/${aspect}.webp`;
        if (fs.existsSync(aspectOldPathWebp)) {
          fs.copyFileSync(aspectOldPathWebp, aspectNewPath.replace('.svg', '.webp'));
          console.log(`  ✓ ${weapon}/${aspect}.webp`);
          copied++;
        } else {
          console.log(`  ✗ ${weapon}/${aspect} - MISSING`);
          missing++;
        }
      }
    });
  });

  // Migrate familiars
  console.log('\nFamiliars:');
  newStructure.familiars.forEach(familiar => {
    const oldPath = `${publicDir}/familiars/${familiar}.png`;
    const newPath = `${newStructureDir}/familiars/${familiar}.png`;
    if (fs.existsSync(oldPath)) {
      fs.copyFileSync(oldPath, newPath);
      console.log(`  ✓ ${familiar}.png`);
      copied++;
    } else {
      console.log(`  ✗ ${familiar}.png - MISSING`);
      missing++;
    }
  });

  console.log('\n═══════════════════════════════════════');
  console.log(`✓ Copied: ${copied} files`);
  console.log(`✗ Missing: ${missing} files`);
  console.log('═══════════════════════════════════════\n');
}

// Generate path mapping for BoonSeeder.cs update
function generatePathMapping() {
  console.log('📝 Generating path mapping for BoonSeeder.cs...\n');

  const mapping = {};

  // Gods
  newStructure.gods.forEach(god => {
    mapping[god] = `/images/gods/${god}.webp`;
  });

  // Boons
  Object.entries(newStructure.boons).forEach(([god, types]) => {
    if (god === 'duo') {
      types.forEach(boon => {
        mapping[boon] = `/images/boons/duo/${boon}.webp`;
      });
    } else {
      Object.entries(types).forEach(([type, boons]) => {
        boons.forEach(boon => {
          mapping[boon] = `/images/boons/${god}/${type}/${boon}.webp`;
        });
      });
    }
  });

  // Weapons
  Object.entries(newStructure.weapons).forEach(([weapon, data]) => {
    mapping[`weapon_${weapon}`] = `/images/weapons/${weapon}/base.svg`;
    data.aspects.forEach(aspect => {
      mapping[aspect] = `/images/weapons/${weapon}/${aspect}.svg`;
    });
  });

  // Familiars
  newStructure.familiars.forEach(familiar => {
    mapping[familiar] = `/images/familiars/${familiar}.png`;
  });

  // Save mapping to file
  fs.writeFileSync('./image-path-mapping.json', JSON.stringify(mapping, null, 2));
  console.log('✓ Saved path mapping to image-path-mapping.json\n');

  return mapping;
}

// Main execution
console.log('\n╔═══════════════════════════════════════════════════════╗');
console.log('║      BOONBUILDER IMAGE REORGANIZATION SCRIPT         ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

try {
  createNewStructure();
  migrateFiles();
  const mapping = generatePathMapping();

  console.log('✅ Migration complete!\n');
  console.log('Next steps:');
  console.log('1. Review the new structure in: ' + newStructureDir);
  console.log('2. Once verified, rename:');
  console.log('   - mv images images_old');
  console.log('   - mv images_new images');
  console.log('3. Update BoonSeeder.cs using image-path-mapping.json');
  console.log('4. Delete boonbuilder.db and restart API\n');
} catch (error) {
  console.error('❌ Error during migration:', error);
  process.exit(1);
}
