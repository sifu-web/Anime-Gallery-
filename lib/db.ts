import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  // Thrown at request time (not at build time) so `next build` doesn't
  // require secrets to be present.
  console.warn('DATABASE_URL is not set. Database calls will fail until it is configured.');
}

// `sql` is a tagged-template query function: sql`select * from images where id = ${id}`
// It uses HTTP under the hood, so it works from serverless/edge runtimes without
// managing a connection pool ourselves.
export const sql = neon(process.env.DATABASE_URL || '');
