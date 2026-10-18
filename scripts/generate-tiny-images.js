import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = 'e:/QB/wedding/thakshila bhanuka/public/pre';
const tinyDir = 'e:/QB/wedding/thakshila bhanuka/public/pre-tiny';

if (!fs.existsSync(tinyDir)) {
  fs.mkdirSync(tinyDir);
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpeg'));

async function generateTiny() {
  for (const file of files) {
    const filePath = path.join(dir, file);
    const tinyFilePath = path.join(tinyDir, file);
    
    console.log(`Processing ${file}...`);
    try {
      await sharp(filePath)
        .resize(30)
        .blur(5)
        .jpeg({ quality: 20 })
        .toFile(tinyFilePath);
        
      console.log(`Created tiny version for ${file}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

generateTiny();
