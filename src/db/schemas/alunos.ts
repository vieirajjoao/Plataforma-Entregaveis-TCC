import { pgTable, uuid, varchar, integer, boolean } from 'drizzle-orm/pg-core';
import { turmas } from './turmas';

export const alunos = pgTable('alunos', {
  id: uuid('id').defaultRandom().primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  idade: integer('idade').notNull(),
  login: varchar('login', { length: 255 }).unique().notNull(), // Ex: joao.vieira
  senhaTemporaria: varchar('senha_temporaria', { length: 50 }), // Visível apenas enquanto precisar trocar
  precisaTrocarSenha: boolean('precisa_trocar_senha').default(true).notNull(),
  turmaId: uuid('turma_id').references(() => turmas.id).notNull(),
  authUserId: uuid('auth_user_id').unique(), 
});