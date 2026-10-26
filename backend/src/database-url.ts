/** Keep Prisma's pooled Supabase connection behaviour consistent for services and one-off tools. */
export function getPrismaDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  try {
    const url = new URL(databaseUrl);
    const usesPooler = url.hostname.includes('pooler.supabase.com') || url.port === '6543';
    if (usesPooler && !url.searchParams.has('pgbouncer')) url.searchParams.set('pgbouncer', 'true');
    if (usesPooler && !url.searchParams.has('connection_limit')) url.searchParams.set('connection_limit', '10');
    if (usesPooler && !url.searchParams.has('pool_timeout')) url.searchParams.set('pool_timeout', '30');
    return url.toString();
  } catch {
    return databaseUrl;
  }
}
