import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const professores = pgTable('professores', {
  id: uuid('id').defaultRandom().primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
});