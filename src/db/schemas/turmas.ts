import { pgTable, uuid, varchar, date } from 'drizzle-orm/pg-core';
import { professores } from './professores';

export const turmas = pgTable('turmas', {
  id: uuid('id').defaultRandom().primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(), // Novo campo! Ex: "TCC 1 - SI"
  diaSemana: varchar('dia_semana', { length: 50 }).notNull(),
  dataInicio: date('data_inicio').notNull(),
  dataFim: date('data_fim').notNull(),
  horario: varchar('horario', { length: 50 }).notNull(),
  sala: varchar('sala', { length: 50 }).notNull(),
  professorId: uuid('professor_id').references(() => professores.id).notNull(),
});