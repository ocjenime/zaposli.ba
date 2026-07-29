const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nwgbrvpomjkzkofjknyi.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z2JydnBvbWpremtvZmprbnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzk4MzcsImV4cCI6MjEwMDkxNTgzN30.DAocTT5b2tcds9dIGm_nVW6y9vIm7BnVecPcZqxVa8I';

const EMAIL = 'ivanovmail92@icloud.com';
const PASSWORD = '12345678';

async function main() {
  const supabase = createClient(SUPABASE_URL, ANON_KEY);

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: EMAIL,
    password: PASSWORD,
  });

  if (signInError) {
    console.error('Sign in error:', signInError.message);
    process.exit(1);
  }

  console.log('Signed in:', signInData.user.id);
  console.log('Access token:', signInData.session.access_token.substring(0, 20) + '...');

  const userSupabase = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${signInData.session.access_token}` } },
    auth: { persistSession: false },
  });

  const { data: profile, error: profileError } = await userSupabase
    .from('profiles')
    .select('*')
    .eq('id', signInData.user.id)
    .maybeSingle();

  console.log('Profile:', profile);
  console.log('Profile error:', profileError);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
