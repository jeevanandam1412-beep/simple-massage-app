const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const passwords = ['jeeva1412@@@', 'jeeva1412@@', 'jeeva1412@', 'jeeva1412'];
const host = 'db.tedsmytgpfecikwqejxy.supabase.co';

async function runMigration() {
  const migrationSql = fs.readFileSync(
    path.join(__dirname, '../supabase/migrations/20260731000000_realtime_saas_schema.sql'),
    'utf8'
  );
  const seedSql = fs.readFileSync(
    path.join(__dirname, '../supabase/seed.sql'),
    'utf8'
  );

  let client;
  let connected = false;

  for (const pwd of passwords) {
    try {
      console.log(`Testing database password variant: ${pwd.replace(/./g, '*')}`);
      client = new Client({
        host,
        port: 5432,
        user: 'postgres',
        password: pwd,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 8000,
      });
      await client.connect();
      connected = true;
      console.log('✅ Successfully authenticated and connected to Live Supabase database!');
      break;
    } catch (err) {
      console.warn(`Authentication failed with this password variant: ${err.message}`);
    }
  }

  if (!connected || !client) {
    console.error('Could not authenticate. Please verify your Supabase database password.');
    process.exit(1);
  }

  try {
    console.log('Executing Supabase Schema Migration...');
    await client.query(migrationSql);
    console.log('✅ Schema Migration successfully applied to live Supabase!');

    console.log('Executing Seed Data Insertion...');
    await client.query(seedSql);
    console.log('✅ Seed Data successfully inserted!');
  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    await client.end();
  }
}

runMigration();
