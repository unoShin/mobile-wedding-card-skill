const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'images/final');

async function optimize() {
  if (!fs.existsSync(targetDir)) {
    console.error(`Target directory does not exist: ${targetDir}`);
    return;
  }

  const files = fs.readdirSync(targetDir);
  for (const file of files) {
    if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')) {
      const filePath = path.join(targetDir, file);
      const tempPath = path.join(targetDir, 'temp_' + file);
      
      const stats = fs.statSync(filePath);
      console.log(`Optimizing ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);
      
      try {
        await sharp(filePath)
          .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 85, mozjpeg: true })
          .toFile(tempPath);
          
        fs.renameSync(tempPath, filePath);
        const newStats = fs.statSync(filePath);
        console.log(`-> Done: ${(newStats.size / 1024).toFixed(0)} KB`);
      } catch (err) {
        console.error(`Failed to optimize ${file}:`, err);
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      }
    }
  }
  console.log('Optimization complete!');
}

optimize();
