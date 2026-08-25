// One-time admin seeding script.
//
// Usage:
//   node --env-file=.env.local scripts/seed-admins.mjs
//
// ⚠️ IMPORTANT
// The two accounts below are seeded with the usernames/passwords you asked
// for so you can log in immediately after deploying. Please log in and
// change both passwords (or delete these rows and create new ones with
// your own values) as soon as the site is live — and never commit this
// file to a public repository with real production passwords left in it.

import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL);

const ADMINS_TO_SEED = [
  { username: 'Sifat', password: 'cycle1997' },
  { username: 'Sowad', password: 'anime' }
];

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Pass it via --env-file or export it first.');
    process.exit(1);
  }

  for (const admin of ADMINS_TO_SEED) {
    const hash = await bcrypt.hash(admin.password, 12);
    await sql`
      INSERT INTO admins (username, password_hash)
      VALUES (${admin.username}, ${hash})
      ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash
    `;
    console.log(`Seeded admin: ${admin.username}`);
  }

  console.log('\nDone. You can now log in at /admin/login.');
  console.log('To add another admin later, add a row to ADMINS_TO_SEED and re-run this script,');
  console.log('or insert directly into the `admins` table with a bcrypt hash.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
