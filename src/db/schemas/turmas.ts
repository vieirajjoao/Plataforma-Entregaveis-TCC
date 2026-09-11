import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { professores } from './professores';

export const turmas = pgTable('turmas', {
  id: uuid('id').defaultRandom().primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  sala: varchar('sala', { length: 50 }).notNull(),
  professorId: uuid('professor_id').references(() => professores.id).notNull(),
});