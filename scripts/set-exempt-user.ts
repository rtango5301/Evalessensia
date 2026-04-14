/**
 * Set or unset rate_limit_exempt flag on a user's app_metadata.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/set-exempt-user.ts <email> [--remove]
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const email = process.argv[2];
const remove = process.argv.includes('--remove');

if (!email) {
  console.error('Usage: npx tsx scripts/set-exempt-user.ts <email> [--remove]');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  // Find user by email
  const { data, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('Failed to list users:', listError.message);
    process.exit(1);
  }

  const user = data.users.find((u) => u.email === email);

  if (!user) {
    console.error(`User not found: ${email}`);
    process.exit(1);
  }

  // Update app_metadata
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: { rate_limit_exempt: !remove },
  });

  if (updateError) {
    console.error('Failed to update user:', updateError.message);
    process.exit(1);
  }

  console.log(
    `${remove ? 'Removed' : 'Set'} rate_limit_exempt=${!remove} for ${email} (${user.id})`
  );
}

main();
