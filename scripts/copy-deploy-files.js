const fs = require('fs');
const path = require('path');

const filesToCopy = ['deploy-examples/nginx.conf'];
const repoRoot = path.resolve(__dirname, '..');
const distDir = path.join(repoRoot, 'dist');

if (!fs.existsSync(distDir)) {
  console.error('dist directory not found. Run build first.');
  process.exit(1);
}

filesToCopy.forEach((rel) => {
  const src = path.join(repoRoot, rel);
  const dest = path.join(distDir, path.basename(rel));
  if (!fs.existsSync(src)) {
    console.warn('Source file not found:', src);
    return;
  }
  fs.copyFileSync(src, dest);
  console.log('Copied', src, '->', dest);
});
