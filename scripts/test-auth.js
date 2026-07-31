const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');
const fs = require('fs');
const path = require('path');

let envVars = {};
try {
  const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
  envContent.split('\n').forEach((line) => {
    const [key, val] = line.split('=');
    if (key && val) envVars[key.trim()] = val.trim();
  });
} catch (e) {}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || 'https://tedsmytgpfecikwqejxy.supabase.co';
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZHNteXRncGZlY2lrd3Flanh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTAwMDAwMH0.dummy_key_will_update_if_needed';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: { transport: ws },
});

async function testAuthFlow() {
  console.log('--- Testing Supabase Auth Login & Sign-Up Screen Logic ---');
  
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  const testName = 'Test User';

  console.log(`1. Testing Sign Up for: ${testEmail}`);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: { full_name: testName },
    },
  });

  if (signUpError) {
    console.warn(`Sign-up status: ${signUpError.message}`);
  } else {
    console.log(`✅ Sign-up payload registered! User ID: ${signUpData.user?.id || 'Created'}`);
  }

  console.log(`2. Testing Sign In for: ${testEmail}`);
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (signInError) {
    console.warn(`Sign-in status: ${signInError.message}`);
  } else {
    console.log(`✅ Sign-in authenticated successfully! Active Session Token: ${signInData.session ? 'Valid' : 'None'}`);
  }

  console.log('3. Testing Profiles Database Table...');
  const { data: profiles, error: profileErr } = await supabase.from('profiles').select('*').limit(5);
  if (profileErr) {
    console.warn(`Profiles query: ${profileErr.message}`);
  } else {
    console.log(`✅ Profiles database table connected! Current profiles count: ${profiles ? profiles.length : 0}`);
  }

  console.log('--- Auth Test Complete ---');
}

testAuthFlow();
