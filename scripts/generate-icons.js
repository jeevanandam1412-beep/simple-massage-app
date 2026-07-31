const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate simple valid SVG icons as PNG fallback data URIs / SVG files
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="128" fill="#000000"/>
  <rect x="32" y="32" width="448" height="448" rx="96" stroke="#27272a" stroke-width="8"/>
  <path d="M256 128C185.308 128 128 185.308 128 256C128 326.692 185.308 384 256 384C326.692 384 384 326.692 384 256C384 185.308 326.692 128 256 128Z" stroke="#ffffff" stroke-width="24"/>
  <path d="M256 192L288 240H224L256 192Z" fill="#ffffff"/>
  <path d="M256 320V256" stroke="#ffffff" stroke-width="24" stroke-linecap="round"/>
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon-192.svg'), svgIcon);
fs.writeFileSync(path.join(iconsDir, 'icon-512.svg'), svgIcon);

// Minimal 1x1 base64 transparent PNG fallback for missing image handlers
const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const pngBuffer = Buffer.from(base64Png, 'base64');

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), pngBuffer);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), pngBuffer);
fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), pngBuffer);

console.log('PWA icon assets generated successfully!');
