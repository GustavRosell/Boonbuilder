const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Function to check if URL exists before downloading
function checkUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.request(url, { method: 'HEAD' }, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

// Function to download a single image with error handling
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;

    const req = client.get(url, (response) => {
      if (response.statusCode === 200) {
        const writeStream = fs.createWriteStream(filepath);
        response.pipe(writeStream);

        writeStream.on('finish', () => {
          writeStream.close();
          console.log(`✅ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });

        writeStream.on('error', reject);
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        if (response.headers.location) {
          console.log(`🔄 Redirecting: ${url} -> ${response.headers.location}`);
          downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        }
      } else {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
      }
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error(`Timeout: ${url}`));
    });
  });
}

// Create a placeholder image for failed downloads
function createPlaceholder(filepath, name) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#6B46C1"/>
    <text x="100" y="100" fill="white" text-anchor="middle" dominant-baseline="central" font-family="Arial" font-size="14">${name}</text>
  </svg>`;

  fs.writeFileSync(filepath.replace(/\.(png|jpg|jpeg|webp)$/, '.svg'), svg);
  console.log(`🔸 Created placeholder: ${path.basename(filepath)}`);
}

// Working IGN URLs (these are more reliable)
const workingUrls = {
  gods: {
    'aphrodite': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/8/8e/Flutter_Strike_Aphrodite.png',
    'apollo': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/f/fc/Nova_Strike_Apollo.png',
    'ares': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/c/c5/Wounding_Strike_Ares.png',
    'demeter': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/7/74/Frost_Strike_Demeter.png',
    'hephaestus': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/3/3c/Volcanic_Strike_Hephaestus.png',
    'hera': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/e/e5/Sworn_Strike_Hera.png',
    'hestia': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/7/7b/Flame_Strike_Hestia.png',
    'poseidon': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/b/bf/Wave_Strike_II.png',
    'zeus': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/b/b1/Heaven_Strike_II.png'
  }
};

// Core boon URLs (IGN sources)
const boonUrls = {
  // Aphrodite
  'flutter_strike': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/8/8e/Flutter_Strike_Aphrodite.png',
  'flutter_flourish': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/f/fc/Flutter_Flourish_Aphrodite.png',
  'rapture_ring': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/9/9f/Rapture_Ring_Aphrodite.png',
  'passion_rush': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/5/59/Passion_Sprint_Aphrodite.png',
  'glamour_gain': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/7/79/Glamour_Gain_Aphrodite.png',

  // Apollo
  'nova_strike': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/f/fc/Nova_Strike_Apollo.png',
  'nova_flourish': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/0/06/Nova_Flourish_Apollo.png',
  'lucid_ring': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/9/9f/Lucid_Ring_Apollo.png',
  'blinding_rush': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/b/b0/Blinding_Sprint_Apollo.png',
  'solar_gain': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/4/41/Solar_Gain_Apollo.png',

  // Zeus
  'heaven_strike': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/b/b1/Heaven_Strike_II.png',
  'heaven_flourish': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/e/e8/Heaven_Flourish_II.png',
  'storm_ring': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/5/56/Storm_Ring_II.png',
  'thunder_rush': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/b/ba/Thunder_Rush_II.png',
  'ionic_gain': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/1/15/Ionic_Gain_II.png'
};

async function downloadSafeImages() {
  const baseDir = './boonbuilder-frontend/public/images';

  // Ensure directories exist
  const dirs = [
    'gods',
    'boons/core',
    'boons/duo',
    'boons/legendary',
    'weapons',
    'aspects'
  ];

  dirs.forEach(dir => {
    const fullPath = path.join(baseDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📁 Created directory: ${fullPath}`);
    }
  });

  try {
    // Download god images (using working boon images as god representations)
    console.log('📥 Downloading god images...');
    for (const [name, url] of Object.entries(workingUrls.gods)) {
      const filepath = path.join(baseDir, 'gods', `${name}.png`);
      try {
        await downloadImage(url, filepath);
      } catch (error) {
        console.log(`⚠️ Failed to download ${name}: ${error.message}`);
        createPlaceholder(filepath, name.charAt(0).toUpperCase() + name.slice(1));
      }
    }

    // Download core boons
    console.log('📥 Downloading core boon images...');
    for (const [name, url] of Object.entries(boonUrls)) {
      const filepath = path.join(baseDir, 'boons/core', `${name}.png`);
      try {
        await downloadImage(url, filepath);
      } catch (error) {
        console.log(`⚠️ Failed to download ${name}: ${error.message}`);
        createPlaceholder(filepath, name.replace(/_/g, ' '));
      }
    }

    // Create some placeholder duo and legendary boons
    console.log('📥 Creating placeholder duo and legendary boons...');
    const duoBoons = ['island_getaway', 'romantic_spark', 'beach_ball', 'glorious_disaster'];
    const legendaryBoons = ['king_tide', 'shocking_loss'];

    duoBoons.forEach(name => {
      const filepath = path.join(baseDir, 'boons/duo', `${name}.svg`);
      createPlaceholder(filepath, name.replace(/_/g, ' '));
    });

    legendaryBoons.forEach(name => {
      const filepath = path.join(baseDir, 'boons/legendary', `${name}.svg`);
      createPlaceholder(filepath, name.replace(/_/g, ' '));
    });

    console.log('🎉 Safe image download completed!');
    console.log('💡 Next steps:');
    console.log('   1. Update BoonSeeder.cs to use local image paths');
    console.log('   2. Add fallback logic for missing images in frontend');
    console.log('   3. Test the frontend for improved loading');

  } catch (error) {
    console.error('❌ Download failed:', error);
  }
}

// Run the safe download
downloadSafeImages();