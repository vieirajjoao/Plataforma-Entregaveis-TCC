import { db } from '@/src/db'
import { turmas, alunos, professores, atividades } from '@/src/db/schemas'
import { eq, desc } from 'drizzle-orm'
import { adicionarAluno, inativarAluno, restaurarAluno } from '@/src/app/actions/alunos'
import FormularioNovaTurma from '@/src/components/FormularioNovaTurma'

export default async function ProfessorDashboard() {
  const professorList = await db.select().from(professores).limit(1)
  const professorAtual = professorList[0]

  if (!professorAtual) {
    return <div className="p-8 text-red-600 font-bold">Crie um professor no banco de dados primeiro!</div>
  }

  const turmasDoProfessor = await db.select().from(turmas).where(eq(turmas.professorId, professorAtual.id))
  const todosAlunosAtivos = await db.select().from(alunos).where(eq(alunos.ativo, true))
  const todosAlunosInativos = await db.select().from(alunos).where(eq(alunos.ativo, false))
  const todasAtividades = await db.select().from(atividades).orderBy(desc(atividades.dataSubmissao))

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        <header className="flex justify-between items-end border-b border-gray-300 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Painel do Professor</h1>
            <p className="text-gray-600 mt-1">Bem-vindo(a), {professorAtual.nome}</p>
          </div>
        </header>

        {/* BOTÃO E FORMULÁRIO OCULTO DE NOVA TURMA */}
        <div className="flex justify-end">
          <FormularioNovaTurma professorId={professorAtual.id} />
        </div>

        {/* LISTA DE TURMAS (FECHADAS POR PADRÃO) */}
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
                <details key={turma.id} className="bg-white rounded-xl shadow-sm border border-gray-200 group overflow-hidden">
                  
                  {/* CABEÇALHO DA TURMA (Sempre visível, clicável para expandir) */}
                  <summary className="p-6 cursor-pointer list-none flex justify-between items-center hover:bg-gray-50 transition">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 group-open:text-emerald-700 transition-colors">{turma.nome}</h2>
                      <p className="text-sm text-gray-500 mt-1">{turma.diaSemana} | {turma.horario} | Sala: {turma.sala}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm bg-gray-200 px-3 py-1 rounded-full text-gray-700 font-medium">
                        {alunosDestaTurma.length} Alunos
                      </span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform duration-300">▼</span>
                    </div>
                  </summary>

                  {/* CONTEÚDO EXPANSÍVEL (Alunos e Envios - Só aparece ao clicar) */}
                  <div className="p-6 pt-0 border-t border-gray-100 bg-gray-50/50">
                    
                    <form action={adicionarAluno} className="flex flex-wrap gap-2 my-6 items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <input type="hidden" name="turmaId" value={turma.id} />
                      <input type="text" name="nome" placeholder="Nome do Aluno" required className="border p-2 rounded text-sm flex-1 min-w-[200px]" />
                      <input type="number" name="idade" placeholder="Idade" required className="border p-2 rounded text-sm w-24" />
                      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold">
                        + Adicionar Aluno
                      </button>
                    </form>

                    {/* LISTA DE ALUNOS ATIVOS */}
                    {alunosDestaTurma.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm bg-white rounded-lg border border-gray-200">
                          <thead className="bg-gray-100 text-gray-600">
                            <tr>
                              <th className="p-3 rounded-tl-lg w-1/2">Aluno & Entregas</th>
                              <th className="p-3">Login</th>
                              <th className="p-3 rounded-tr-lg">Acesso Inicial</th>
                            </tr>
                          </thead>
                          <tbody>
                            {alunosDestaTurma.map(aluno => {
                              const envios = todasAtividades.filter(e => e.alunoId === aluno.id)
                              const inativarAction = inativarAluno.bind(null, aluno.id)

                              return (
                                <tr key={aluno.id} className="border-b last:border-0 align-top hover:bg-gray-50 transition-colors">
                                  <td className="p-3">
                                    <div className="flex justify-between items-start">
                                      <div className="font-bold text-gray-800 text-base">{aluno.nome}</div>
                                      <form action={inativarAction}>
                                        <button type="submit" className="text-red-500 hover:bg-red-50 px-2 py-1 rounded text-xs font-semibold transition border border-transparent hover:border-red-200">
                                          Remover
                                        </button>
                                      </form>
                                    </div>

                                    {envios.length > 0 ? (
                                      <details className="mt-2 group/envios">
                                        <summary className="cursor-pointer text-blue-600 text-xs font-semibold select-none hover:underline">
                                          Ver {envios.length} envio(s)
                                        </summary>
                                        <div className="mt-3 space-y-3 border-l-2 border-blue-200 pl-3">
                                          {envios.map(envio => (
                                            <div key={envio.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                              <div className="flex justify-between items-start mb-1">
                                                <p className="font-bold text-gray-700 text-sm">{envio.titulo}</p>
                                                <p className="text-[10px] text-gray-400">
                                                  {envio.dataSubmissao.toLocaleDateString('pt-BR')}
                                                </p>
                                              </div>
                                              <p className="text-xs text-gray-600 mb-2 whitespace-pre-wrap">{envio.descricao}</p>

                                              {envio.arquivos && envio.arquivos.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                                                  {envio.arquivos.map((arq, idx) => (
                                                    <a key={idx} href={arq.url} target="_blank" rel="noopener noreferrer" className="bg-gray-50 border border-gray-200 text-blue-600 px-2 py-1 rounded text-[10px] hover:bg-blue-50 transition font-medium">
                                                      📎 {arq.nome}
                                                    </a>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </details>
                                    ) : (
                                      <p className="mt-1 text-xs text-gray-400 italic">Nenhum envio realizado.</p>
                                    )}
                                  </td>
                                  <td className="p-3 text-gray-600 font-mono mt-1 block">{aluno.login}</td>
                                  <td className="p-3">
                                    {aluno.precisaTrocarSenha ? (
                                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-mono font-bold">
                                        {aluno.senhaTemporaria}
                                      </span>
                                    ) : (
                                      <span className="text-emerald-600 text-xs font-semibold">Definida pelo aluno</span>
                                    )}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Nenhum aluno ativo nesta turma.</p>
                    )}

                    {/* SESSÃO DE ALUNOS INATIVOS */}
                    {inativosDestaTurma.length > 0 && (
                      <details className="mt-6 border-t border-gray-200 pt-4 group/inativos">
                        <summary className="cursor-pointer text-gray-500 hover:text-gray-700 text-sm font-semibold select-none flex items-center gap-2">
                          <span>Alunos Arquivados ({inativosDestaTurma.length})</span>
                          <span className="text-[10px] group-open/inativos:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="mt-4 space-y-3 pl-2 border-l-2 border-gray-200">
                          {inativosDestaTurma.map(alunoInativo => {
                             const restaurarAction = restaurarAluno.bind(null, alunoInativo.id)
                             return (
                               <div key={alunoInativo.id} className="flex justify-between items-center text-sm text-gray-500 bg-white border border-gray-200 shadow-sm p-3 rounded-lg">
                                 <span>{alunoInativo.nome} <span className="text-xs text-gray-400 ml-2">({alunoInativo.login})</span></span>
                                 <form action={restaurarAction}>
                                    <button type="submit" className="text-blue-500 hover:underline text-xs font-semibold">Restaurar Acesso</button>
                                 </form>
                               </div>
                             )
                          })}
                        </div>
                      </details>
                    )}
                  </div>
                </details>
              )
            })
          )}
        </section>
      </div>
    </main>
  );
}