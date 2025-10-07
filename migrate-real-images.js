const fs = require('fs');
const path = require('path');

// Configuration
const imageTestDir = './image_test';
const publicImagesDir = './boonbuilder-frontend/public/images';
const oldImagesDir = './boonbuilder-frontend/public/images_old';

// God name mappings
const gods = ['aphrodite', 'apollo', 'ares', 'artemis', 'demeter', 'hephaestus', 'hera', 'hermes', 'hestia', 'poseidon', 'zeus'];

// Known boon names from BoonSeeder.cs
const knownBoons = {
  aphrodite: {
    core: ['flutter_strike', 'flutter_flourish', 'rapture_ring', 'passion_rush', 'glamour_gain'],
    legendary: ['passion_flare']
  },
  apollo: {
    core: ['nova_strike', 'nova_flourish', 'solar_ring', 'blinding_sprint', 'lucid_gain'],
    legendary: ['perfect_shot']
  },
  ares: {
    core: ['vicious_strike', 'vicious_flourish', 'blade_rift', 'battle_sprint', 'blood_frenzy'],
    legendary: ['unending_stamina']
  },
  demeter: {
    core: ['frost_strike', 'frost_flourish', 'frozen_touch', 'frigid_sprint', 'rare_crop'],
    legendary: ['winter_harvest']
  },
  hephaestus: {
    core: ['volcanic_strike', 'volcanic_flourish', 'molten_touch', 'forge_sprint', 'smoldering_air'],
    legendary: ['volcanic_ash']
  },
  hera: {
    core: ['nexus_strike', 'nexus_flourish', 'engagement_ring', 'nexus_sprint', 'greater_recall'],
    legendary: ['all_together']
  },
  hestia: {
    core: ['flame_strike', 'flame_flourish', 'hearth_gain', 'soot_sprint', 'controlled_burn'],
    legendary: ['fire_away']
  },
  poseidon: {
    core: ['wave_strike', 'wave_flourish', 'tidal_ring', 'breaker_sprint', 'flood_gain'],
    legendary: ['king_tide']
  },
  zeus: {
    core: ['heaven_strike', 'heaven_flourish', 'storm_ring', 'thunder_rush', 'ionic_gain'],
    legendary: ['shocking_loss']
  }
};

// Duo boons
const duoBoons = [
  'burning_desire', 'carnal_pleasure', 'ecstatic_obsession', 'hearty_appetite',
  'island_getaway', 'love_handles', 'romantic_spark', 'sunny_disposition',
  'beach_ball', 'cutting_edge', 'glorious_disaster', 'rude_awakening',
  'sun_worshiper', 'tropical_cyclone', 'warm_breeze', 'torrential_downpour'
];

// Normalize filename for matching
function normalizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/[_\s-]+/g, '_')
    .replace(/\([^)]*\)/g, '') // Remove (1) etc
    .replace(/\.webp$/, '')
    .replace(/\.png$/, '')
    .replace(/\.jpg$/, '')
    .trim()
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

// Extract god name from filename
function extractGod(filename) {
  const normalized = normalizeFilename(filename);
  for (const god of gods) {
    if (normalized.includes(god)) {
      return god;
    }
  }
  return null;
}

// Match filename to boon name
function matchBoon(filename, god) {
  const normalized = normalizeFilename(filename);

  // Try exact match first
  if (god && knownBoons[god]) {
    // Check core boons
    for (const boon of knownBoons[god].core || []) {
      if (normalized.includes(boon.replace(/_/g, ''))) {
        return { god, type: 'core', boon };
      }
    }
    // Check legendary
    for (const boon of knownBoons[god].legendary || []) {
      if (normalized.includes(boon.replace(/_/g, ''))) {
        return { god, type: 'legendary', boon };
      }
    }
  }

  // Check duo boons
  for (const boon of duoBoons) {
    if (normalized.includes(boon.replace(/_/g, ''))) {
      return { type: 'duo', boon };
    }
  }

  // Try fuzzy matching for core boons
  for (const [godName, boons] of Object.entries(knownBoons)) {
    for (const boon of boons.core || []) {
      const boonWords = boon.split('_');
      const allWordsPresent = boonWords.every(word => normalized.includes(word));
      if (allWordsPresent) {
        return { god: godName, type: 'core', boon };
      }
    }
    for (const boon of boons.legendary || []) {
      const boonWords = boon.split('_');
      const allWordsPresent = boonWords.every(word => normalized.includes(word));
      if (allWordsPresent) {
        return { god: godName, type: 'legendary', boon };
      }
    }
  }

  return null;
}

// Scan all images
function scanImages() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║         REAL IMAGE MIGRATION SCRIPT                  ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  const results = {
    matched: [],
    unmatched: [],
    ambiguous: [],
    total: 0
  };

  // Scan image_test directories
  const testDirs = fs.readdirSync(imageTestDir).filter(f => fs.statSync(path.join(imageTestDir, f)).isDirectory());

  console.log(`📁 Found ${testDirs.length} test directories\n`);

  for (const dir of testDirs) {
    const dirPath = path.join(imageTestDir, dir);
    const files = fs.readdirSync(dirPath).filter(f => f.match(/\.(webp|png|jpg)$/i));

    console.log(`\n📂 ${dir} (${files.length} images)`);
    console.log('─'.repeat(55));

    for (const file of files) {
      results.total++;
      const fullPath = path.join(dirPath, file);
      const god = extractGod(file);
      const match = matchBoon(file, god);

      if (match) {
        let targetPath;
        if (match.type === 'duo') {
          targetPath = `${publicImagesDir}/boons/duo/${match.boon}.webp`;
        } else {
          targetPath = `${publicImagesDir}/boons/${match.god}/${match.type}/${match.boon}.webp`;
        }

        results.matched.push({
          source: fullPath,
          target: targetPath,
          filename: file,
          match: match
        });

        console.log(`  ✓ ${file} → ${match.god ? match.god + '/' + match.type : match.type}/${match.boon}`);
      } else {
        results.unmatched.push({
          source: fullPath,
          filename: file,
          dir: dir
        });
        console.log(`  ✗ ${file} - NO MATCH`);
      }
    }
  }

  return results;
}

// Copy god portraits
function copyGodPortraits() {
  console.log('\n\n🎨 Copying God Portraits...\n');
  console.log('─'.repeat(55));

  const godsDir = `${publicImagesDir}/gods`;
  const oldGodsDir = `${oldImagesDir}/gods`;

  if (!fs.existsSync(godsDir)) {
    fs.mkdirSync(godsDir, { recursive: true });
  }

  let copied = 0;
  let missing = 0;

  for (const god of ['aphrodite', 'apollo', 'ares', 'demeter', 'hephaestus', 'hera', 'hestia', 'poseidon', 'zeus']) {
    const oldPath = `${oldGodsDir}/${god}.webp`;
    const newPath = `${godsDir}/${god}.webp`;

    if (fs.existsSync(oldPath)) {
      fs.copyFileSync(oldPath, newPath);
      console.log(`  ✓ ${god}.webp`);
      copied++;
    } else {
      // Try SVG
      const svgPath = `${oldGodsDir}/${god}.svg`;
      if (fs.existsSync(svgPath)) {
        console.log(`  ⚠ ${god}.webp - only .svg available (needs conversion)`);
        missing++;
      } else {
        console.log(`  ✗ ${god}.webp - MISSING`);
        missing++;
      }
    }
  }

  console.log(`\n✓ Copied: ${copied} god portraits`);
  console.log(`✗ Missing: ${missing} god portraits`);

  return { copied, missing };
}

// Perform migration
function migrateImages(results) {
  console.log('\n\n🚀 Migrating Real Images...\n');
  console.log('─'.repeat(55));

  let copied = 0;
  let failed = 0;

  for (const item of results.matched) {
    try {
      // Ensure directory exists
      const targetDir = path.dirname(item.target);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Copy file
      fs.copyFileSync(item.source, item.target);
      console.log(`  ✓ ${item.filename} → ${item.target.replace(publicImagesDir, '')}`);
      copied++;
    } catch (err) {
      console.log(`  ✗ ${item.filename} - ERROR: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✓ Copied: ${copied} images`);
  console.log(`✗ Failed: ${failed} images`);

  return { copied, failed };
}

// Generate report
function generateReport(scanResults, godResults, migrateResults) {
  console.log('\n\n╔═══════════════════════════════════════════════════════╗');
  console.log('║                  MIGRATION COMPLETE                   ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  console.log('📊 SUMMARY:');
  console.log('─'.repeat(55));
  console.log(`Total images found:     ${scanResults.total}`);
  console.log(`✓ Successfully matched: ${scanResults.matched.length}`);
  console.log(`✗ Unmatched:            ${scanResults.unmatched.length}`);
  console.log(`\n🎨 God Portraits:`);
  console.log(`✓ Copied:               ${godResults.copied}`);
  console.log(`✗ Missing:              ${godResults.missing}`);
  console.log(`\n🚀 Migration:`);
  console.log(`✓ Copied:               ${migrateResults.copied}`);
  console.log(`✗ Failed:               ${migrateResults.failed}`);
  console.log('─'.repeat(55));

  // Save unmatched list
  if (scanResults.unmatched.length > 0) {
    console.log(`\n⚠️  UNMATCHED IMAGES (${scanResults.unmatched.length}):\n`);
    for (const item of scanResults.unmatched.slice(0, 20)) {
      console.log(`  - ${item.filename} (${item.dir})`);
    }
    if (scanResults.unmatched.length > 20) {
      console.log(`  ... and ${scanResults.unmatched.length - 20} more`);
    }

    // Save to file
    const unmatchedList = scanResults.unmatched.map(item => `${item.filename} (${item.dir})`).join('\n');
    fs.writeFileSync('./unmatched-images.txt', unmatchedList);
    console.log(`\n📝 Full list saved to: unmatched-images.txt`);
  }

  console.log('\n✅ Migration complete! Restart your API and refresh frontend.\n');
}

// Main execution
try {
  const scanResults = scanImages();
  const godResults = copyGodPortraits();
  const migrateResults = migrateImages(scanResults);
  generateReport(scanResults, godResults, migrateResults);
} catch (error) {
  console.error('❌ Error during migration:', error);
  process.exit(1);
}
