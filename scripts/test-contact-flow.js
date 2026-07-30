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

  const { error: profileError } = await userSupabase.from('profiles').insert({
    id: user.id,
    email,
    full_name: role === 'client' ? 'Test klijent' : firmName,
    role,
  });
  if (profileError) throw new Error(`Profile insert failed for ${email}: ${profileError.message}`);

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

  return { user, session, firm };
}

async function signIn(email, password) {
  const supabase = createClient(SUPABASE_URL, ANON_KEY);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`Sign in failed for ${email}: ${error.message}`);
  return { user: data.user, session: data.session, supabase: createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${data.session.access_token}` } },
    auth: { persistSession: false },
  }) };
}

async function main() {
  console.log('=== Testing two-stage contact flow ===\n');

  // 1. Create client and firm
  console.log('1. Creating client account...');
  const client = await signUpAndCreateProfile(CLIENT_EMAIL, CLIENT_PASS, 'client', null);
  console.log('   Client OK:', client.user.id);

  console.log('2. Creating firm account...');
  const firm = await signUpAndCreateProfile(FIRM_EMAIL, FIRM_PASS, 'firm', `Test Firma ${timestamp}`);
  console.log('   Firm OK:', firm.user.id, 'Firm ID:', firm.firm.id);

  // 2. Client signs in and posts job
  console.log('3. Client posting job...');
  const clientSession = await signIn(CLIENT_EMAIL, CLIENT_PASS);
  const { data: job, error: jobError } = await clientSession.supabase
    .from('jobs')
    .insert({
      client_id: client.user.id,
      category_slug: 'gradjevinarstvo',
      title: 'Test posao - kontakt flow',
      description: 'Testni posao za provjeru kontakt flowa',
      city: 'Sarajevo',
    })
    .select()
    .single();
  if (jobError) throw new Error(`Job insert failed: ${jobError.message}`);
  console.log('   Job OK:', job.id);

  // 3. Firm signs in and bids
  console.log('4. Firm placing bid...');
  const firmSession = await signIn(FIRM_EMAIL, FIRM_PASS);
  const { data: bid, error: bidError } = await firmSession.supabase
    .from('bids')
    .insert({
      job_id: job.id,
      firm_id: firm.firm.id,
      amount: 1000,
      message: 'Naša ponuda za testni posao',
    })
    .select()
    .single();
  if (bidError) throw new Error(`Bid insert failed: ${bidError.message}`);
  console.log('   Bid OK:', bid.id);

  // 4. Client accepts bid
  console.log('5. Client accepting bid...');
  const { error: acceptBidError } = await clientSession.supabase
    .from('bids')
    .update({ status: 'accepted' })
    .eq('id', bid.id);
  if (acceptBidError) throw new Error(`Accept bid failed: ${acceptBidError.message}`);

  const { error: jobStatusError } = await clientSession.supabase
    .from('jobs')
    .update({ status: 'in_progress' })
    .eq('id', job.id);
  if (jobStatusError) throw new Error(`Job status update failed: ${jobStatusError.message}`);
  console.log('   Bid accepted, job in_progress');

  // 5. Firm accesses chat
  console.log('6. Firm accessing chat...');
  const { data: firmChatJob, error: firmChatError } = await firmSession.supabase
    .from('jobs')
    .select('id,title,city,client_id,status')
    .eq('id', job.id)
    .single();
  if (firmChatError) throw new Error(`Firm chat job fetch failed: ${firmChatError.message}`);

  const { data: firmAcceptedBid, error: firmBidCheckError } = await firmSession.supabase
    .from('bids')
    .select('id')
    .eq('job_id', job.id)
    .eq('firm_id', firm.firm.id)
    .eq('status', 'accepted')
    .single();
  if (firmBidCheckError || !firmAcceptedBid) throw new Error('Firm cannot access chat: no accepted bid');
  console.log('   Firm chat access OK');

  // 6. Client accesses chat
  console.log('7. Client accessing chat...');
  const { data: clientChatJob, error: clientChatError } = await clientSession.supabase
    .from('jobs')
    .select('id,title,city,client_id,status')
    .eq('id', job.id)
    .single();
  if (clientChatError) throw new Error(`Client chat job fetch failed: ${clientChatError.message}`);
  if (clientChatJob.client_id !== client.user.id) throw new Error('Client is not job owner');
  console.log('   Client chat access OK');

  // 7. Client sends message
  console.log('8. Client sending message...');
  const { data: msg1, error: msg1Error } = await clientSession.supabase
    .from('messages')
    .insert({ job_id: job.id, sender_id: client.user.id, content: 'Zdravo, kada možete doći?', read: false })
    .select()
    .single();
  if (msg1Error) throw new Error(`Client message failed: ${msg1Error.message}`);
  console.log('   Client message OK:', msg1.id);

  // 8. Firm reads messages
  console.log('9. Firm reading messages...');
  const { data: firmMessages, error: firmMessagesError } = await firmSession.supabase
    .from('messages')
    .select('*')
    .eq('job_id', job.id)
    .order('created_at', { ascending: true });
  if (firmMessagesError) throw new Error(`Firm messages fetch failed: ${firmMessagesError.message}`);
  if (firmMessages.length !== 1) throw new Error(`Expected 1 message, got ${firmMessages.length}`);
  if (firmMessages[0].content !== 'Zdravo, kada možete doći?') throw new Error('Message content mismatch');
  console.log('   Firm sees message OK');

  // 9. Firm replies
  console.log('10. Firm replying...');
  const { data: msg2, error: msg2Error } = await firmSession.supabase
    .from('messages')
    .insert({ job_id: job.id, sender_id: firm.user.id, content: 'Možemo sutra u 10h.', read: false })
    .select()
    .single();
  if (msg2Error) throw new Error(`Firm reply failed: ${msg2Error.message}`);
  console.log('    Firm reply OK:', msg2.id);

  // 10. Client reads messages
  console.log('11. Client reading messages...');
  const { data: clientMessages, error: clientMessagesError } = await clientSession.supabase
    .from('messages')
    .select('*')
    .eq('job_id', job.id)
    .order('created_at', { ascending: true });
  if (clientMessagesError) throw new Error(`Client messages fetch failed: ${clientMessagesError.message}`);
  if (clientMessages.length !== 2) throw new Error(`Expected 2 messages, got ${clientMessages.length}`);
  console.log('    Client sees both messages OK');

  console.log('\n=== ALL CHECKS PASSED ===');
  console.log('Two-stage contact flow works correctly.');

  // Cleanup
  console.log('\n=== Cleaning up test data ===');
  await clientSession.supabase.from('messages').delete().eq('job_id', job.id);
  await clientSession.supabase.from('bids').delete().eq('job_id', job.id);
  await clientSession.supabase.from('jobs').delete().eq('id', job.id);
  await clientSession.supabase.from('firm_categories').delete().eq('firm_id', firm.firm.id);
  await clientSession.supabase.from('firms').delete().eq('id', firm.firm.id);
  await clientSession.supabase.from('profiles').delete().eq('id', client.user.id);
  await clientSession.supabase.from('profiles').delete().eq('id', firm.user.id);
  console.log('Cleanup done.');
}

main().catch((err) => {
  console.error('\n=== TEST FAILED ===');
  console.error(err.message);
  process.exit(1);
});
