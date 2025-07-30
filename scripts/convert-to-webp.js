const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imageDir = path.join(__dirname, '..', 'public', 'images');

function findNonWebPImages(dir, images = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findNonWebPImages(fullPath, images);
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        images.push(fullPath);
      }
    }
  }

  return images;
}

async function convertToWebP(imagePath) {
  const dir = path.dirname(imagePath);
  const name = path.basename(imagePath, path.extname(imagePath));
  const webpPath = path.join(dir, `${name}.webp`);

  // Skip if WebP already exists
  if (fs.existsSync(webpPath)) {
    console.log(`⏭️  Skipping ${imagePath} - WebP already exists`);
    return;
  }

  try {
    // Convert to WebP using Sharp with quality 85
    await sharp(imagePath).webp({ quality: 85, effort: 6 }).toFile(webpPath);

    // Get file sizes for comparison
    const originalSize = fs.statSync(imagePath).size;
    const webpSize = fs.statSync(webpPath).size;
    const savings = (((originalSize - webpSize) / originalSize) * 100).toFixed(1);

    console.log(`✅ Converted: ${path.relative(imageDir, imagePath)}`);
    console.log(
      `   Original: ${(originalSize / 1024).toFixed(1)}KB → WebP: ${(webpSize / 1024).toFixed(1)}KB (${savings}% smaller)`
    );

    // Optionally remove original (commented out for safety)
    // fs.unlinkSync(imagePath);
  } catch (error) {
    console.error(`❌ Failed to convert ${imagePath}:`, error.message);
  }
}

async function main() {
  console.log('🔍 Finding non-WebP images...');
  const images = findNonWebPImages(imageDir);

  console.log(`📊 Found ${images.length} images to convert:`);
  images.forEach((img) => console.log(`   ${path.relative(imageDir, img)}`));

  if (images.length === 0) {
    console.log('✨ All images are already optimized!');
    return;
  }

  console.log('\n🚀 Starting conversion...');
  let converted = 0;
  let skipped = 0;

  for (const imagePath of images) {
    const webpPath = path.join(
      path.dirname(imagePath),
      path.basename(imagePath, path.extname(imagePath)) + '.webp'
    );

    if (fs.existsSync(webpPath)) {
      skipped++;
    } else {
      await convertToWebP(imagePath);
      converted++;
    }
  }

  console.log(`\n✨ Conversion complete!`);
  console.log(`   Converted: ${converted} images`);
  console.log(`   Skipped: ${skipped} images (already had WebP versions)`);
  console.log(`   Total processed: ${images.length} images`);
}

if (require.main === module) {
  main();
}

module.exports = { findNonWebPImages, convertToWebP };
