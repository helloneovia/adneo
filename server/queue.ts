import PgBoss from "pg-boss";

let _boss: PgBoss | null = null;

export async function getQueue(): Promise<PgBoss | null> {
  if (!_boss && process.env.DATABASE_URL) {
    const dbUrl = process.env.DATABASE_URL;
    const needsSsl = dbUrl.includes('sslmode=require') || dbUrl.includes('ssl=true') || dbUrl.includes('neon.tech') || dbUrl.includes('supabase');
    
    _boss = new PgBoss({
      connectionString: dbUrl,
      ssl: needsSsl ? { rejectUnauthorized: false } as any : false
    });
    
    _boss.on('error', error => console.error('[PgBoss Error]', error));
    
    await _boss.start();
    console.log('[PgBoss] Queue system started');
  }
  return _boss;
}
