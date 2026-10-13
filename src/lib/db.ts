import { neon } from "@neondatabase/serverless";

/**
 * A direct, schema-less connection to eklo-application's *production*
 * database -- deliberately not Prisma. This site has no Prisma schema of
 * its own, and introducing one pointed at the same physical database
 * eklo-application's own Prisma schema already manages would mean two
 * separate schemas sharing one `_prisma_migrations` history table, which
 * is a real way to corrupt that tracking. A plain tagged-SQL client needs
 * nothing from that history -- it only ever runs the few read queries (the
 * stats strip) and the one insert (LaunchInterest signups) this site
 * actually needs.
 *
 * Read `DATABASE_URL` lazily inside each call rather than at module load,
 * so a missing env var fails the one request that needed it instead of
 * crashing the whole site at build/boot time.
 */
export function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local.");
  }
  return neon(url);
}
