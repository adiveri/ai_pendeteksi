const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'node_modules', '@tensorflow', 'tfjs-backend-wasm', 'dist');
const dest = path.join(__dirname, '..', 'public', 'wasm');

if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

fs.readdirSync(src).forEach(file => {
  if (file.endsWith('.wasm')) {
    fs.copyFileSync(path.join(src, file), path.join(dest, file));
    console.log(`Copied ${file}`);
  }
});