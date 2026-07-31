const fs = require('fs');
const path = require('path');

// Base64 encoded valid 32x32 PNG favicon
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABMSURBVHgB7dKxEQAgCAMAwP2n82sB7yE0i1RpmhIym2v3e9e3A7A4wAEEA4QBBBMAEAYQTBBAEEAwAQBhAMEEAQQTHO4AAAAA//8DABc7AR/R1j8dAAAAAElFTkSuQmCC';
const buffer = Buffer.from(pngBase64, 'base64');

const publicPath = path.join(__dirname, '../public/favicon.ico');
const appPath = path.join(__dirname, '../src/app/favicon.ico');

fs.writeFileSync(publicPath, buffer);
fs.writeFileSync(appPath, buffer);

console.log('✅ favicon.ico successfully generated in public/ and src/app/!');
