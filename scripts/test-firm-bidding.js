const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nwgbrvpomjkzkofjknyi.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z2JydnBvbWpremtvZmprbnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzk4MzcsImV4cCI6MjEwMDkxNTgzN30.DAocTT5b2tcds9dIGm_nVW6y9vIm7BnVecPcZqxVa8I';

const timestamp = Date.now();
const CLIENT_EMAIL = `test-client-${timestamp}@example.com`;
const CLIENT_PASS = 'testpass123';
const FIRM_EMAIL = `test-firm-${timestamp}@example.com`;
const FIRM_PASS = 'testpass123';

async function signUpAndCreateProfile(email, password, role, firmName) {
  const supabase = createClient(SUPABASE_URL, ANON_KEY);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError) throw new Error(`Sign up failed for ${email}: ${signUpError.message}`);

  const user = signUpData.user;
  const session = signUpData.session;
  if (!user || !session) throw new Error(`No user/session for ${email}`);

  const userSupabase = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${session.access_token}` } },
    auth: { persistSession: false },
  });

  await userSupabase.from('profiles').insert({
    id: user.id,
    email,
    full_name: role === 'client' ? 'Test klijent' : firmName,
    role,
  });

  let firm = null;
  if (role === 'firm') {
    const slug = firmName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 60);
    const { data: firmData, error: firmError } = await userSupabase
      .from('firms')
      .insert({ owner_id: user.id, name: firmName, slug, email, city: 'Sarajevo' })
      .select()
      .single();
    if (firmError) throw new Error(`Firm insert failed: ${firmError.message}`);
    firm = firmData;
  }

  return { user, firm };
}

async function signIn(email, password) {
  const supabase = createClient(SUPABASE_URL, ANON_KEY);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`Sign in failed for ${email}: ${error.message}`);
  return createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${data.session.access_token}` } },
    auth: { persistSession: false },
  });
}

async function main() {
  console.log('=== Testing firm bidding flow ===\n');

  console.log('1. Creating test accounts...');
  const client = await signUpAndCreateProfile(CLIENT_EMAIL, CLIENT_PASS, 'client', null);
  const firm = await signUpAndCreateProfile(FIRM_EMAIL, FIRM_PASS, 'firm', `Test Firma ${timestamp}`);
  console.log('   Firm ID:', firm.firm.id);

  console.log('2. Client posting job...');
  const clientSupabase = await signIn(CLIENT_EMAIL, CLIENT_PASS);
  const { data: job, error: jobError } = await clientSupabase
    .from('jobs')
    .insert({
      client_id: client.user.id,
      category_slug: 'gradjevinarstvo',
      title: 'Test posao za firmu',
      description: 'Test opis',
      city: 'Sarajevo',
    })
    .select()
    .single();
  if (jobError) throw new Error(`Job insert failed: ${jobError.message}`);
  console.log('   Job ID:', job.id);

  console.log('3. Firm fetching open jobs...');
  const firmSupabase = await signIn(FIRM_EMAIL, FIRM_PASS);
  const { data: openJobs, error: openJobsError } = await firmSupabase
    .from('jobs')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false });
  if (openJobsError) throw new Error(`Open jobs fetch failed: ${openJobsError.message}`);
  console.log('   Open jobs found:', openJobs.length);
  const foundJob = openJobs.find((j) => j.id === job.id);
  if (!foundJob) throw new Error('Newly created job not found in open jobs');

  console.log('4. Firm checking subscription/usage...');
  const { data: bidsCount, error: bidsCountError } = await firmSupabase
    .from('bids')
    .select('*', { count: 'exact', head: true })
    .eq('firm_id', firm.firm.id);
  if (bidsCountError) throw new Error(`Bids count failed: ${bidsCountError.message}`);
  console.log('   Bids used this month:', bidsCount);

  const { data: subscription, error: subError } = await firmSupabase
    .from('subscriptions')
    .select('*, plans(*)')
    .eq('firm_id', firm.firm.id)
    .in('status', ['active', 'cancelled'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  console.log('   Subscription:', subscription ? 'found' : 'none', subError ? `(error: ${subError.message})` : '');
  const bidsLimit = subscription?.plans?.bids_per_month ?? 5;
  const canBid = bidsLimit === 9999 || bidsCount < bidsLimit;
  console.log('   Bids limit:', bidsLimit, 'canBid:', canBid);
  if (!canBid) throw new Error('Firm cannot bid: limit reached');

  console.log('5. Firm checking existing bids on job...');
  const { data: existingBids, error: existingBidsError } = await firmSupabase
    .from('bids')
    .select('*')
    .eq('job_id', job.id)
    .eq('firm_id', firm.firm.id);
  if (existingBidsError) throw new Error(`Existing bids check failed: ${existingBidsError.message}`);
  console.log('   Existing bids on this job:', existingBids.length);
  if (existingBids.length > 0) throw new Error('Firm already bid on this job');

  console.log('6. Firm placing bid...');
  const { data: bid, error: bidError } = await firmSupabase
    .from('bids')
    .insert({
      job_id: job.id,
      firm_id: firm.firm.id,
      amount: 1000,
      message: 'Test ponuda',
    })
    .select()
    .single();
  if (bidError) throw new Error(`Bid insert failed: ${bidError.message}`);
  console.log('   Bid OK:', bid.id);

  console.log('\n=== FIRM CAN BID ===');
  console.log('The flow works for a fresh firm account.');

  console.log('\n=== Cleaning up ===');
  await clientSupabase.from('bids').delete().eq('job_id', job.id);
  await clientSupabase.from('jobs').delete().eq('id', job.id);
  await clientSupabase.from('firms').delete().eq('id', firm.firm.id);
  await clientSupabase.from('profiles').delete().eq('id', client.user.id);
  await clientSupabase.from('profiles').delete().eq('id', firm.user.id);
  console.log('Cleanup done.');
}

main().catch((err) => {
  console.error('\n=== TEST FAILED ===');
  console.error(err.message);
  process.exit(1);
});
