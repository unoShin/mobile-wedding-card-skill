#!/usr/bin/env node

/**
 * scaffold.js
 * Scaffolds a complete Mobile Wedding Card project into the specified directory.
 * Usage: node scaffold.js [target-directory]
 */

const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2] 
  ? path.resolve(process.cwd(), process.argv[2]) 
  : process.cwd();

const templateDir = path.resolve(__dirname, '../templates');

console.log(`🌸 Scaffolding Mobile Wedding Card project...`);
console.log(`📁 Target: ${targetDir}`);

if (!fs.existsSync(templateDir)) {
  console.error(`❌ Template directory not found at: ${templateDir}`);
  process.exit(1);
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  + Created: ${path.relative(targetDir, destPath)}`);
    }
  }
}

try {
  copyDirRecursive(templateDir, targetDir);

  // Ensure images/org directory exists
  const imagesOrgDir = path.join(targetDir, 'images/org');
  if (!fs.existsSync(imagesOrgDir)) {
    fs.mkdirSync(imagesOrgDir, { recursive: true });
  }

  // Ensure deploy.sh is executable
  const deployScript = path.join(targetDir, 'deploy.sh');
  if (fs.existsSync(deployScript)) {
    try {
      fs.chmodSync(deployScript, '755');
    } catch (e) {}
  }

  console.log(`\n🎉 Mobile Wedding Card project scaffolded successfully!`);
  console.log(`\nNext Steps:`);
  console.log(`  1. cd ${path.relative(process.cwd(), targetDir) || '.'}`);
  console.log(`  2. npm install`);
  console.log(`  3. Edit data/config.json with the couple's details & wedding date`);
  console.log(`  4. Add photos into images/final/ and run: node optimize_images.js`);
  console.log(`  5. Verify rendering with: npm test`);
  console.log(`  6. Deploy to GitHub Pages with: ./deploy.sh\n`);
} catch (err) {
  console.error(`❌ Scaffolding failed:`, err);
  process.exit(1);
}
