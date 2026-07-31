const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const secret = 'super-secret-jwt-token-with-at-least-32-characters-long';
const payload = {
  iss: 'supabase',
  ref: 'tedsmytgpfecikwqejxy',
  role: 'anon',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60), // 10 years
};

const token = jwt.sign(payload, secret);
console.log('Generated JWT Anon Key:', token);

// Update .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = `NEXT_PUBLIC_SUPABASE_URL=https://tedsmytgpfecikwqejxy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=${token}
DATABASE_URL=postgresql://postgres:jeeva1412%40%40@db.tedsmytgpfecikwqejxy.supabase.co:5432/postgres
`;

fs.writeFileSync(envPath, envContent);
console.log('.env.local updated with signed Supabase key!');
