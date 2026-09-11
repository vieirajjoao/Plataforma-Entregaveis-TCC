import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schemas';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("A variável de ambiente DATABASE_URL não está definida.");
}

// O prepare: false é necessário ao usar o pooler de conexões do Supabase (PgBouncer)
const client = postgres(connectionString, { prepare: false });

// O Drizzle agora recebe um único objeto de configuração
export const db = drizzle({ client });