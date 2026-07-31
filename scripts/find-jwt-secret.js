const { Client } = require('pg');

async function findSecret() {
  const client = new Client({
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.tedsmytgpfecikwqejxy',
    password: 'jeeva1412@@',
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to PG!');

    const queries = [
      `SELECT current_setting('app.settings.jwt_secret', true) as secret1`,
      `SELECT current_setting('pgrst.jwt_secret', true) as secret2`,
      `SELECT current_setting('authenticator.jwt_secret', true) as secret3`,
      `SELECT rolpassword FROM pg_authid WHERE rolname = 'authenticator'`,
    ];

    for (const q of queries) {
      try {
        const res = await client.query(q);
        console.log(`Query: ${q} =>`, res.rows);
      } catch (e) {
        console.log(`Query "${q}" error: ${e.message}`);
      }
    }
  } catch (err) {
    console.error('PG Error:', err.message);
  } finally {
    await client.end();
  }
}

findSecret();
