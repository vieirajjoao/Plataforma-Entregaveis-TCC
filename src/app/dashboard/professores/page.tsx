export const dynamic = 'force-dynamic'

import { db } from '@/src/db'
import { turmas, alunos, professores, atividades } from '@/src/db/schemas'
import { eq, desc, asc } from 'drizzle-orm'
import FormularioNovaTurma from '@/src/components/FormularioNovaTurma'
import BotaoSair from '@/src/components/BotaoSair'
import TurmaCard from '@/src/components/TurmaCard'

export default async function ProfessorDashboard() {
  const professorList = await db.select().from(professores).limit(1)
  const professorAtual = professorList[0]

  if (!professorAtual) {
    return <div className="p-8 text-red-600 font-bold">Crie um professor no banco de dados primeiro!</div>
  }

  // Turmas ordenadas pelo nome
  const turmasDoProfessor = await db.select().from(turmas)
    .where(eq(turmas.professorId, professorAtual.id))
    .orderBy(asc(turmas.nome))

  // Alunos rigorosamente ordenados de A a Z
  const todosAlunosAtivos = await db.select().from(alunos)
    .where(eq(alunos.ativo, true))
    .orderBy(asc(alunos.nome))

  const todosAlunosInativos = await db.select().from(alunos)
    .where(eq(alunos.ativo, false))
    .orderBy(asc(alunos.nome))

  const todasAtividades = await db.select().from(atividades)
    .orderBy(desc(atividades.dataSubmissao))

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        <header className="flex justify-between items-end border-b border-gray-300 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Painel do Professor</h1>
            <p className="text-gray-600 mt-1">Bem-vindo(a), {professorAtual.nome}</p>
          </div>
          <BotaoSair />
        </header>

        <div className="flex justify-end">
          <FormularioNovaTurma professorId={professorAtual.id} />
        </div>

        <section className="space-y-4">
          {turmasDoProfessor.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500 border border-gray-200">
              Você ainda não possui turmas cadastradas.
            </div>
          ) : (
            turmasDoProfessor.map((turma) => {
              const alunosDestaTurma = todosAlunosAtivos.filter(a => a.turmaId === turma.id)
              const inativosDestaTurma = todosAlunosInativos.filter(a => a.turmaId === turma.id)

              return (
                <TurmaCard
                  key={turma.id}
                  turma={turma}
                  alunosAtivos={alunosDestaTurma}
                  alunosInativos={inativosDestaTurma}
                  atividades={todasAtividades}
                />
              )
            })
          )}
        </section>
      </div>
    </main>
  );
}