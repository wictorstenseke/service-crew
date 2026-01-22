import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const inputImage = join(projectRoot, 'public', '004-mechanic.png');
const outputImage = join(projectRoot, 'public', 'apple-touch-icon.png');

// Check if input image exists
if (!existsSync(inputImage)) {
  console.error(`Error: Input image not found at ${inputImage}`);
  process.exit(1);
}

const size = 180;
const padding = 36; // 20% padding
const imageSize = size - (padding * 2);

console.log('Generating padded apple-touch-icon...');
console.log(`Size: ${size}x${size}px`);
console.log(`Padding: ${padding}px (20%)`);
console.log(`Image size: ${imageSize}x${imageSize}px`);

try {
  // Create a white background
  const background = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  });

  // Resize and composite the mechanic image on top
  const composite = await sharp(inputImage)
    .resize(imageSize, imageSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  await background
    .composite([{
      input: composite,
      left: padding,
      top: padding
    }])
    .png()
    .toFile(outputImage);

  console.log(`✅ Icon generated successfully: ${outputImage}`);
  console.log('Update index.html to use apple-touch-icon.png');
} catch (error) {
  console.error('Error generating icon:', error);
  process.exit(1);
}
