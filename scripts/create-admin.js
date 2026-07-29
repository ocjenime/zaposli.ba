const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nwgbrvpomjkzkofjknyi.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z2JydnBvbWpremtvZmprbnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzk4MzcsImV4cCI6MjEwMDkxNTgzN30.DAocTT5b2tcds9dIGm_nVW6y9vIm7BnVecPcZqxVa8I';

const EMAIL = 'ivanovmail92@icloud.com';
const PASSWORD = '12345678';

async function main() {
  const supabase = createClient(SUPABASE_URL, ANON_KEY);

  // Try to sign up
  let session = null;
  let user = null;

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: EMAIL,
    password: PASSWORD,
  });

  if (signUpError) {
    if (signUpError.message.toLowerCase().includes('already registered') || signUpError.message.toLowerCase().includes('already exists')) {
      console.log('User exists, signing in...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: EMAIL,
        password: PASSWORD,
      });
      if (signInError) {
        console.error('Sign in error:', signInError.message);
        process.exit(1);
      }
      session = signInData.session;
      user = signInData.user;
    } else {
      console.error('Sign up error:', signUpError.message);
      process.exit(1);
    }
  } else {
    session = signUpData.session;
    user = signUpData.user;
    console.log('New user created:', user.id);
  }

  if (!user || !session) {
    console.error('No user or session');
    process.exit(1);
  }

  // Create supabase client with user token
  const userSupabase = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${session.access_token}` } },
    auth: { persistSession: false },
  });

  // Upsert profile to avoid select recursion issues
  console.log('Upserting profile with admin rights...');
  const { error: upsertError } = await userSupabase.from('profiles').upsert({
    id: user.id,
    email: EMAIL,
    full_name: 'Admin',
    role: 'client',
    is_admin: true,
  }, { onConflict: 'id' });

  if (upsertError) {
    console.error('Profile upsert error:', upsertError.message);
    process.exit(1);
  }
  console.log('Profile upserted with admin rights.');

  console.log('Admin user ready:', EMAIL);
  console.log('User ID:', user.id);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
