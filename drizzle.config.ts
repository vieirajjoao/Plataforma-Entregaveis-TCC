import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Força a leitura do arquivo .env.local (ou altere para '.env' se for o caso)
dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL está faltando no .env");
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schemas/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose:true,
  strict:true,
  schemaFilter: ["public"], 
});
