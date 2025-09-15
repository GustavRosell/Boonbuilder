# 🖼️ BoonBuilder Image Replacement Guide

## Overview
This guide shows you how to replace placeholder images with real Hades II game images for instant loading. We've successfully implemented this for Apollo boons as a proof-of-concept.

## Quick Start (Apollo Example)
✅ **Apollo is already working!** Check `apollo_boon_test/` folder for the process we used.

## File Structure
```
boonbuilder-frontend/public/images/
├── gods/           (god portraits)
│   ├── apollo.webp ✅ (working)
│   ├── aphrodite.svg (placeholder)
│   └── ...
├── boons/
│   ├── core/       (main boons for each slot)
│   │   ├── nova_flourish.webp ✅ (working)
│   │   ├── flutter_strike.svg (placeholder)
│   │   └── ...
│   ├── duo/        (duo boons requiring 2 gods)
│   │   ├── beach_ball.webp ✅ (working)
│   │   ├── island_getaway.svg (placeholder)
│   │   └── ...
│   └── legendary/  (rare boons with complex requirements)
│       ├── perfect_shot.webp ✅ (working)
│       ├── king_tide.svg (placeholder)
│       └── ...
├── weapons/        (weapon icons)
└── aspects/        (weapon aspect icons)
```

## Step-by-Step Process

### Step 1: Download Your Images
Download Hades II boon/god images from any source (screenshots, wikis, etc.)
- Format: `.webp`, `.png`, or `.jpg` (WebP preferred for smaller size)
- Size: Any size works (we'll scale in CSS)

### Step 2: Identify What You Have vs What's Needed

**Check what boons exist for a god:**
```bash
# Find all boons for Zeus (GodId = 9)
grep -n "GodId = 9" BoonBuilder.API/Data/BoonSeeder.cs
```

**Check current image paths:**
```bash
# See what Zeus boons expect
grep -A 5 -B 5 "GodId = 9" BoonBuilder.API/Data/BoonSeeder.cs | grep IconUrl
```

### Step 3: Rename and Place Images

**Naming Convention:**
- Remove spaces, special characters
- Use lowercase with underscores
- Match the backend expectation exactly

**Examples:**
```
Your Download Name          →  Required Name              →  Location
"Heaven_Strike_Zeus.png"    →  "heaven_strike.webp"      →  boons/core/
"Glorious_Disaster.webp"    →  "glorious_disaster.webp"  →  boons/duo/
"Zeus_Portrait.jpg"         →  "zeus.webp"               →  gods/
```

### Step 4: Update Backend Paths

**For each god you're updating, change `.svg` to `.webp` in BoonSeeder.cs:**

```csharp
// BEFORE (placeholder):
IconUrl = "/images/boons/core/heaven_strike.svg"

// AFTER (real image):
IconUrl = "/images/boons/core/heaven_strike.webp"
```

**Find and replace for a specific god:**
```bash
# Example: Update all Zeus boons from .svg to .webp
# (Do this carefully for each boon you have images for)
```

### Step 5: Test the Changes

```bash
# Delete old database to force reseed
rm -f BoonBuilder.API/boonbuilder.db

# Build frontend to check for errors
cd boonbuilder-frontend
npm run build

# Start API (will recreate DB with new image paths)
cd BoonBuilder.API
dotnet run
```

## Template Commands for Each God

### Zeus Example (GodId = 9)
```bash
# 1. Copy your Zeus images (rename as needed)
cp "your_zeus_folder/Heaven_Strike.webp" "boonbuilder-frontend/public/images/boons/core/heaven_strike.webp"
cp "your_zeus_folder/Heaven_Flourish.webp" "boonbuilder-frontend/public/images/boons/core/heaven_flourish.webp"
cp "your_zeus_folder/Storm_Ring.webp" "boonbuilder-frontend/public/images/boons/core/storm_ring.webp"
cp "your_zeus_folder/Thunder_Rush.webp" "boonbuilder-frontend/public/images/boons/core/thunder_rush.webp"
cp "your_zeus_folder/Ionic_Gain.webp" "boonbuilder-frontend/public/images/boons/core/ionic_gain.webp"
cp "your_zeus_folder/Zeus_Portrait.webp" "boonbuilder-frontend/public/images/gods/zeus.webp"

# 2. Update backend (edit BoonSeeder.cs manually)
# Change all Zeus boon IconUrls from .svg to .webp

# 3. Test
rm -f BoonBuilder.API/boonbuilder.db
cd boonbuilder-frontend && npm run build
```

### Aphrodite Example (GodId = 1)
```bash
# Aphrodite core boons to replace:
# flutter_strike.svg → flutter_strike.webp
# flutter_flourish.svg → flutter_flourish.webp
# rapture_ring.svg → rapture_ring.webp
# passion_rush.svg → passion_rush.webp
# glamour_gain.svg → glamour_gain.webp
```

## Current Backend Mappings

### Apollo (✅ Working)
- **Core Boons**: nova_strike, nova_flourish, solar_ring, blinding_sprint, lucid_gain
- **Duo Boons**: beach_ball, glorious_disaster, sun_worshiper
- **Legendary**: perfect_shot
- **God Portrait**: apollo.webp

### Zeus (❌ Needs Images)
- **Core Boons**: heaven_strike, heaven_flourish, storm_ring, thunder_rush, ionic_gain
- **Duo Boons**: romantic_spark, glorious_disaster (shared)
- **Legendary**: shocking_loss

### Aphrodite (❌ Needs Images)
- **Core Boons**: flutter_strike, flutter_flourish, rapture_ring, passion_rush, glamour_gain
- **Duo Boons**: island_getaway, romantic_spark, sunny_disposition

## Troubleshooting

### Images Not Showing Up
1. **Check file extension**: Backend expects `.webp` but you placed `.png`
2. **Check file name**: Case sensitive! `Nova_Strike.webp` ≠ `nova_strike.webp`
3. **Clear browser cache**: Hard refresh (Ctrl+F5)
4. **Check developer console**: Look for 404 errors

### Database Issues
```bash
# Nuclear option: Delete DB and restart API
rm -f BoonBuilder.API/boonbuilder.db
cd BoonBuilder.API && dotnet run
```

### Path Issues
```bash
# Verify image is in correct location
ls -la boonbuilder-frontend/public/images/boons/core/nova_strike.webp

# Check what backend expects
grep -n "nova_strike" BoonBuilder.API/Data/BoonSeeder.cs
```

## Advanced Tips

### Batch Rename Script
```bash
# Convert all PNG to WebP and rename to lowercase with underscores
# (requires imagemagick: apt install imagemagick)
for file in *.png; do
  newname=$(echo "$file" | tr '[:upper:]' '[:lower:]' | tr ' ' '_' | sed 's/.png/.webp/')
  convert "$file" "$newname"
done
```

### Find All Missing Images
```bash
# List all .svg placeholder files that could be replaced
find boonbuilder-frontend/public/images -name "*.svg" | grep -v "node_modules"
```

### Verify All Gods Are Updated
```bash
# Show which gods still use .svg (placeholders)
grep -n "IconUrl.*\.svg" BoonBuilder.API/Data/BoonSeeder.cs
```

## Image Sources & Tips

### Where to Find Images
- **Hades Wiki**: Often has clean boon icons
- **Game Screenshots**: Capture from your own gameplay
- **Streaming/YouTube**: Screenshot from gameplay videos
- **Reddit/Discord**: Community often shares asset collections

### Image Quality Tips
- **Size**: 200x200px minimum, any size works
- **Format**: WebP preferred (smaller), PNG/JPG also work
- **Background**: Transparent PNG or solid color both work
- **Quality**: Don't need perfect quality, user interface will scale

## When Deployed Live

✅ **All images load instantly from your domain**
✅ **No external dependencies or broken links**
✅ **WebP format = smaller files = faster loading**
✅ **Works offline once cached**
✅ **Fallback system prevents broken images**

## Next Steps

1. **Pick your favorite god** (Zeus, Aphrodite, Hestia, etc.)
2. **Download 5-6 boon images** for that god
3. **Follow the template above**
4. **Test and enjoy instant loading!**

Once you have 2-3 gods working, you'll have a professional-quality game tool that loads as fast as the game itself! 🚀

---

**Questions?** Check the console output for specific errors, or refer to the Apollo implementation as a working example.