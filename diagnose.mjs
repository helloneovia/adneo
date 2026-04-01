import postgres from "postgres";

const DATABASE_URL = "postgresql://admin:123654789@adneo-db-dfqrpm:5432/db";

// Try with SSL disabled first (internal network)
const sql = postgres(DATABASE_URL, { 
  ssl: false,
  max: 1,
  connect_timeout: 10
});

try {
  console.log("Testing connection...");
  
  // List all tables
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
  console.log("Tables:", tables.map(t => t.table_name));
  
  // Check users table columns
  const cols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position`;
  console.log("Users columns:", cols.map(c => `${c.column_name}:${c.data_type}`));
  
  // Try a simple select
  const result = await sql`SELECT * FROM users LIMIT 1`;
  console.log("Users count query OK, rows:", result.length);
  
} catch (err) {
  console.error("Error:", err.message);
} finally {
  await sql.end();
}
