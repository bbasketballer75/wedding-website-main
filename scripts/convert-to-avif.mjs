import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageDir = path.join(__dirname, '..', 'public', 'images');

function findWebPImagesForAVIF(dir, images = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findWebPImagesForAVIF(fullPath, images);
    } else if (/\.webp$/i.test(item)) {
      const avifPath = fullPath.replace(/\.webp$/i, '.avif');
      if (!fs.existsSync(avifPath)) {
        images.push(fullPath);
      }
    }
  }

  return images;
}

async function convertToAVIF(imagePath) {
  try {
    const avifPath = imagePath.replace(/\.webp$/i, '.avif');

    console.log(`Converting ${path.basename(imagePath)} to AVIF...`);

    await sharp(imagePath)
      .avif({
        quality: 80,
        effort: 4,
        chromaSubsampling: '4:2:0',
      })
      .toFile(avifPath);

    console.log(`✅ Converted: ${path.basename(avifPath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Error converting ${imagePath}:`, error.message);
    return false;
  }
}

async function convertSampleToAVIF() {
  console.log('🔍 Finding WebP images for AVIF conversion...');
  const images = findWebPImagesForAVIF(imageDir);

  if (images.length === 0) {
    console.log('✅ All images already have AVIF versions!');
    return;
  }

  // Convert only first 10 images as a sample for testing
  const sampleImages = images.slice(0, 10);

  console.log(`📸 Converting ${sampleImages.length} sample images to AVIF:`);
  sampleImages.forEach((img) => console.log(`  - ${path.relative(imageDir, img)}`));

  console.log('\n🚀 Starting AVIF conversion...');
  let successCount = 0;

  for (const imagePath of sampleImages) {
    const success = await convertToAVIF(imagePath);
    if (success) successCount++;
  }

  console.log(
    `\n🎉 Sample conversion complete! ${successCount}/${sampleImages.length} images converted to AVIF.`
  );
  console.log(`💡 Total WebP images available for AVIF: ${images.length}`);
  console.log('💡 To convert all images, modify the script to remove the slice(0, 10) limit.');
}

convertSampleToAVIF().catch(console.error);
