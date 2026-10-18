import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

const dir = 'e:/QB/wedding/thakshila bhanuka/public/pre';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpeg'));

async function resize() {
  for (const file of files) {
    const filePath = path.join(dir, file);
    console.log(`Processing ${file}...`);
    try {
      const image = await Jimp.read(filePath);
      if (image.bitmap.width > 800) {
        image.resize(800, Jimp.AUTO);
        await image.writeAsync(filePath);
        console.log(`Resized and saved ${file}`);
      } else {
        console.log(`Skipped ${file} (width: ${image.bitmap.width})`);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

resize();
