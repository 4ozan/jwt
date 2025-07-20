import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';
import { SQL } from 'bun';

if(!process.env.DATABASE_URL){
    throw new Error("DATABASE_URL is not defined")
}
console.log('🔗 Connecting to database...');
const client = new SQL(process.env.DATABASE_URL);
const db = drizzle({ client });
console.log('✅ Database connected successfully');

export default db;

