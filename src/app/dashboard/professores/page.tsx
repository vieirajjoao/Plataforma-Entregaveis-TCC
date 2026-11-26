export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { db } from '@/src/db'
import { turmas, alunos, atividades } from '@/src/db/schemas'
import { getProfessorAutenticado } from '@/src/lib/auth'
import { eq, desc, asc, inArray } from 'drizzle-orm'
import FormularioNovaTurma from '@/src/components/FormularioNovaTurma'
import BotaoSair from '@/src/components/BotaoSair'
import TurmaCard from '@/src/components/TurmaCard'

export default async function ProfessorDashboard() {
  const professorAtual = await getProfessorAutenticado()

  if (!professorAtual) redirect('/login/professor')

  const turmasDoProfessor = await db
    .select()
    .from(turmas)
    .where(eq(turmas.professorId, professorAtual.id))
    .orderBy(asc(turmas.nome))

  const turmaIds = turmasDoProfessor.map((t) => t.id)

  const alunosDasTurmas =
    turmaIds.length > 0
      ? await db
          .select()
          .from(alunos)
          .where(inArray(alunos.turmaId, turmaIds))
          .orderBy(asc(alunos.nome))
      : []

  const alunosAtivos = alunosDasTurmas.filter((a) => a.ativo)
  const alunosInativos = alunosDasTurmas.filter((a) => !a.ativo)
  const alunoIds = alunosDasTurmas.map((a) => a.id)

  const atividadesDasTurmas =
    alunoIds.length > 0
      ? await db
          .select()
          .from(atividades)
          .where(inArray(atividades.alunoId, alunoIds))
          .orderBy(desc(atividades.dataSubmissao))
      : []

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
          <FormularioNovaTurma />
        </div>

        <section className="space-y-4">
          {turmasDoProfessor.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500 border border-gray-200">
              Você ainda não possui turmas cadastradas.
            </div>
          ) : (
            turmasDoProfessor.map((turma) => (
              <TurmaCard
                key={turma.id}
                turma={turma}
                alunosAtivos={alunosAtivos.filter((a) => a.turmaId === turma.id)}
                alunosInativos={alunosInativos.filter((a) => a.turmaId === turma.id)}
                atividades={atividadesDasTurmas}
              />
            ))
          )}
        </section>
      </div>
    </main>
  )
}