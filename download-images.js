const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Image URL mappings extracted from BoonSeeder.cs
const imageUrls = {
  gods: {
    'aphrodite': 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/b/bd/Aphrodite.png',
    'apollo': 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/5a/Apollo.png',
    'ares': 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/9e/Ares.png',
    'demeter': 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/a/a9/Demeter.png',
    'hephaestus': 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/8/88/Hephaestus.png',
    'hera': 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/76/Hera.png',
    'hestia': 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/2/24/Hestia.png',
    'poseidon': 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/d/d0/Poseidon.png',
    'zeus': 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/76/Zeus.png'
  },
  boons: {
    core: {
      // Aphrodite
      'flutter_strike': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/8/8e/Flutter_Strike_Aphrodite.png?width=123&format=jpg&auto=webp&quality=100',
      'flutter_flourish': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/f/fc/Flutter_Flourish_Aphrodite.png?width=123&format=jpg&auto=webp&quality=100',
      'rapture_ring': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/9/9f/Rapture_Ring_Aphrodite.png?width=123&format=jpg&auto=webp&quality=100',
      'passion_rush': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/5/59/Passion_Sprint_Aphrodite.png?width=123&format=jpg&auto=webp&quality=100',
      'glamour_gain': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/7/79/Glamour_Gain_Aphrodite.png?width=123&format=jpg&auto=webp&quality=100',

      // Apollo
      'nova_strike': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/f/fc/Nova_Strike_Apollo.png?width=123&format=jpg&auto=webp&quality=100',
      'nova_flourish': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/0/06/Nova_Flourish_Apollo.png?width=123&format=jpg&auto=webp&quality=100',
      'lucid_ring': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/9/9f/Lucid_Ring_Apollo.png?width=123&format=jpg&auto=webp&quality=100',
      'blinding_rush': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/b/b0/Blinding_Sprint_Apollo.png?width=123&format=jpg&auto=webp&quality=100',
      'solar_gain': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/4/41/Solar_Gain_Apollo.png?width=123&format=jpg&auto=webp&quality=100',

      // Ares
      'wounding_strike': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/c/c5/Wounding_Strike_Ares.png?width=123&format=jpg&auto=webp&quality=100',
      'wounding_flourish': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/d/da/Wounding_Flourish_Ares.png?width=123&format=jpg&auto=webp&quality=100',
      'sword_ring': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/7/75/Sword_Ring_Ares.png?width=123&format=jpg&auto=webp&quality=100',
      'stabbing_rush': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/a/a9/Stabbing_Sprint_Ares.png?width=123&format=jpg&auto=webp&quality=100',
      'blood_gain': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/e/e1/Blood_Gain_Ares.png?width=123&format=jpg&auto=webp&quality=100',

      // Demeter
      'frost_strike': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/7/74/Frost_Strike_Demeter.png?width=123&format=jpg&auto=webp&quality=100',
      'frost_flourish': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/4/44/Frost_Flourish_Demeter.png?width=123&format=jpg&auto=webp&quality=100',
      'ice_ring': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/f/f1/Ice_Ring_Demeter.png?width=123&format=jpg&auto=webp&quality=100',
      'arctic_rush': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/5/5e/Arctic_Sprint_Demeter.png?width=123&format=jpg&auto=webp&quality=100',
      'cold_gain': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/8/8a/Cold_Gain_Demeter.png?width=123&format=jpg&auto=webp&quality=100',

      // Hephaestus
      'volcanic_strike': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/3/3c/Volcanic_Strike_Hephaestus.png?width=123&format=jpg&auto=webp&quality=100',
      'volcanic_flourish': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/1/1e/Volcanic_Flourish_Hephaestus.png?width=123&format=jpg&auto=webp&quality=100',
      'lava_ring': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/0/09/Lava_Ring_Hephaestus.png?width=123&format=jpg&auto=webp&quality=100',
      'powder_rush': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/e/e9/Powder_Sprint_Hephaestus.png?width=123&format=jpg&auto=webp&quality=100',
      'forge_gain': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/1/18/Forge_Gain_Hephaestus.png?width=123&format=jpg&auto=webp&quality=100',

      // Hera
      'sworn_strike': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/e/e5/Sworn_Strike_Hera.png?width=123&format=jpg&auto=webp&quality=100',
      'sworn_flourish': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/3/38/Sworn_Flourish_Hera.png?width=123&format=jpg&auto=webp&quality=100',
      'engagement_ring': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/7/72/Engagement_Ring_Hera.png?width=123&format=jpg&auto=webp&quality=100',
      'loyal_rush': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/3/3a/Loyal_Sprint_Hera.png?width=123&format=jpg&auto=webp&quality=100',
      'born_gain': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/5/55/Born_Gain_Hera.png?width=123&format=jpg&auto=webp&quality=100',

      // Hestia
      'flame_strike': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/7/7b/Flame_Strike_Hestia.png?width=123&format=jpg&auto=webp&quality=100',
      'flame_flourish': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/e/e7/Flame_Flourish_Hestia.png?width=123&format=jpg&auto=webp&quality=100',
      'smolder_ring': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/7/7a/Smolder_Ring_Hestia.png?width=123&format=jpg&auto=webp&quality=100',
      'hearth_rush': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/8/8c/Hearth_Sprint_Hestia.png?width=123&format=jpg&auto=webp&quality=100',
      'kindle_gain': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/4/4c/Kindle_Gain_Hestia.png?width=123&format=jpg&auto=webp&quality=100',

      // Poseidon
      'wave_strike': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/b/bf/Wave_Strike_II.png?width=123&format=jpg&auto=webp&quality=100',
      'wave_flourish': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/a/a3/Wave_Flourish_II.png?width=123&format=jpg&auto=webp&quality=100',
      'tidal_ring': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/7/73/Tidal_Ring_II.png?width=123&format=jpg&auto=webp&quality=100',
      'breaker_sprint': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/4/4f/Breaker_Sprint_II.png?width=123&format=jpg&auto=webp&quality=100',
      'flood_gain': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/f/f9/Flood_Gain_II.png?width=123&format=jpg&auto=webp&quality=100',

      // Zeus
      'heaven_strike': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/b/b1/Heaven_Strike_II.png?width=123&format=jpg&auto=webp&quality=100',
      'heaven_flourish': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/e/e8/Heaven_Flourish_II.png?width=123&format=jpg&auto=webp&quality=100',
      'storm_ring': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/5/56/Storm_Ring_II.png?width=123&format=jpg&auto=webp&quality=100',
      'thunder_rush': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/b/ba/Thunder_Rush_II.png?width=123&format=jpg&auto=webp&quality=100',
      'ionic_gain': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/1/15/Ionic_Gain_II.png?width=123&format=jpg&auto=webp&quality=100'
    },
    duo: {
      'island_getaway': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/3/39/Island_Getaway_II.png?width=123&format=jpg&auto=webp&quality=100',
      'romantic_spark': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/7/72/Romantic_Spark_II.png?width=123&format=jpg&auto=webp&quality=100',
      'beach_ball': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/4/46/Beach_Ball_II.png?width=123&format=jpg&auto=webp&quality=100',
      'glorious_disaster': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/2/27/Glorious_Disaster_II.png?width=123&format=jpg&auto=webp&quality=100'
    },
    legendary: {
      'king_tide': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/f/fe/King_Tide_II.png?width=123&format=jpg&auto=webp&quality=100',
      'shocking_loss': 'https://oyster.ignimgs.com/mediawiki/apis.ign.com/hades-2/8/84/Shocking_Loss_II.png?width=123&format=jpg&auto=webp&quality=100'
    }
  },
  weapons: {
    'witch_staff': 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/4f/Hammer_Staff_Melino%C3%AB.png',
    'sister_blades': 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/1/1d/Hammer_Daggers_Melino%C3%AB_II.png',
    'umbral_flames': 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/53/Hammer_Torch_Melino%C3%AB.png',
    'moonstone_axe': 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/e/ea/Hammer_Axe_Melino%C3%AB.png',
    'argent_skull': 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/a/a5/Aspect_of_Melino%C3%AB_II.png',
    'black_coat': 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/56/Coat_Melino%C3%AB.png'
  }
};

// Function to download a single image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;

    client.get(url, (response) => {
      if (response.statusCode === 200) {
        const writeStream = fs.createWriteStream(filepath);
        response.pipe(writeStream);

        writeStream.on('finish', () => {
          writeStream.close();
          console.log(`✅ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });

        writeStream.on('error', reject);
      } else {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
      }
    }).on('error', reject);
  });
}

// Function to get file extension from URL
function getFileExtension(url) {
  const urlParts = url.split('?')[0]; // Remove query parameters
  const pathParts = urlParts.split('.');
  const ext = pathParts[pathParts.length - 1];
  return ext.toLowerCase() === 'webp' ? 'webp' : 'png';
}

// Main download function
async function downloadAllImages() {
  const baseDir = './boonbuilder-frontend/public/images';

  try {
    // Download gods
    console.log('📥 Downloading god images...');
    for (const [name, url] of Object.entries(imageUrls.gods)) {
      const ext = getFileExtension(url);
      const filepath = path.join(baseDir, 'gods', `${name}.${ext}`);
      await downloadImage(url, filepath);
    }

    // Download core boons
    console.log('📥 Downloading core boon images...');
    for (const [name, url] of Object.entries(imageUrls.boons.core)) {
      const ext = getFileExtension(url);
      const filepath = path.join(baseDir, 'boons/core', `${name}.${ext}`);
      await downloadImage(url, filepath);
    }

    // Download duo boons
    console.log('📥 Downloading duo boon images...');
    for (const [name, url] of Object.entries(imageUrls.boons.duo)) {
      const ext = getFileExtension(url);
      const filepath = path.join(baseDir, 'boons/duo', `${name}.${ext}`);
      await downloadImage(url, filepath);
    }

    // Download legendary boons
    console.log('📥 Downloading legendary boon images...');
    for (const [name, url] of Object.entries(imageUrls.boons.legendary)) {
      const ext = getFileExtension(url);
      const filepath = path.join(baseDir, 'boons/legendary', `${name}.${ext}`);
      await downloadImage(url, filepath);
    }

    // Download weapons
    console.log('📥 Downloading weapon images...');
    for (const [name, url] of Object.entries(imageUrls.weapons)) {
      const ext = getFileExtension(url);
      const filepath = path.join(baseDir, 'weapons', `${name}.${ext}`);
      await downloadImage(url, filepath);
    }

    console.log('🎉 All images downloaded successfully!');
    console.log('💡 Next steps:');
    console.log('   1. Update BoonSeeder.cs to use local image paths');
    console.log('   2. Restart the API to rebuild the database');
    console.log('   3. Test the frontend for faster image loading');

  } catch (error) {
    console.error('❌ Download failed:', error);
  }
}

// Run the download
downloadAllImages();