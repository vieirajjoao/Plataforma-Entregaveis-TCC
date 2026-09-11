import { pgTable, uuid, text, varchar, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { alunos } from './alunos';

export const atividades = pgTable('atividades', {
  id: uuid('id').defaultRandom().primaryKey(),
  alunoId: uuid('aluno_id').references(() => alunos.id).notNull(),
  titulo: varchar('titulo', { length: 255 }).notNull(),
  descricao: text('descricao').notNull(),
  arquivos: jsonb('arquivos').$type<{ nome: string, url: string }[]>().default([]).notNull(),
  dataSubmissao: timestamp('data_submissao').defaultNow().notNull(),
});