import { db } from '@/src/db'
import { turmas, alunos, professores, atividades } from '@/src/db/schemas'
import { eq, desc } from 'drizzle-orm'
import { criarTurma } from '@/src/app/actions/turmas'
import { adicionarAluno, resetarSenhaAluno } from '@/src/app/actions/alunos'

export default async function ProfessorDashboard() {
  const professorList = await db.select().from(professores).limit(1)
  const professorAtual = professorList[0]

  if (!professorAtual) {
    return <div className="p-8 text-red-600 font-bold">Crie um professor no banco de dados primeiro!</div>
  }

  const turmasDoProfessor = await db.select().from(turmas).where(eq(turmas.professorId, professorAtual.id))
  const todosAlunos = await db.select().from(alunos)
  // Busca todas as atividades do banco ordenadas pela data
  const todasAtividades = await db.select().from(atividades).orderBy(desc(atividades.dataSubmissao))

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex justify-between items-end border-b border-gray-300 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Painel do Professor</h1>
            <p className="text-gray-600 mt-1">Bem-vindo(a), {professorAtual.nome}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <h2 className="font-semibold text-lg mb-4 text-gray-800 border-b pb-2">Nova Turma</h2>
              <form action={criarTurma} className="space-y-3 flex flex-col text-sm">
                <input type="hidden" name="professorId" value={professorAtual.id} />
                <input type="text" name="nome" placeholder="Nome da Turma" required className="border p-2 rounded" />
                <input type="text" name="diaSemana" placeholder="Dia da Semana" required className="border p-2 rounded" />
                <input type="date" name="dataInicio" required className="border p-2 rounded text-gray-500" />
                <input type="date" name="dataFim" required className="border p-2 rounded text-gray-500" />
                <input type="text" name="horario" placeholder="Horário (ex: 19h as 22h)" required className="border p-2 rounded" />
                <input type="text" name="sala" placeholder="Sala" required className="border p-2 rounded" />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded">Criar Turma</button>
              </form>
            </div>
          </aside>

          <section className="lg:col-span-3 space-y-6">
            {turmasDoProfessor.length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500 border border-gray-200">
                Você ainda não possui turmas cadastradas.
              </div>
            ) : (
              turmasDoProfessor.map((turma) => {
                const alunosDestaTurma = todosAlunos.filter(a => a.turmaId === turma.id)
                
                return (
                  <div key={turma.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-800">{turma.nome}</h2>
                      <p className="text-sm text-gray-500">{turma.diaSemana} | {turma.horario} | Sala: {turma.sala}</p>
                    </div>

                    <form action={adicionarAluno} className="flex flex-wrap gap-2 mb-6 items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <input type="hidden" name="turmaId" value={turma.id} />
                      <input type="text" name="nome" placeholder="Nome do Aluno" required className="border p-2 rounded text-sm flex-1 min-w-[200px]" />
                      <input type="number" name="idade" placeholder="Idade" required className="border p-2 rounded text-sm w-24" />
                      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold">
                        + Adicionar Aluno
                      </button>
                    </form>

                    {alunosDestaTurma.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-100 text-gray-600">
                            <tr>
                              <th className="p-3 rounded-l-lg w-1/2">Aluno & Entregas</th>
                              <th className="p-3">Login</th>
                              <th className="p-3">Acesso Inicial</th>
                            </tr>
                          </thead>
                          <tbody>
                            {alunosDestaTurma.map(aluno => {
                              const envios = todasAtividades.filter(e => e.alunoId === aluno.id)

                              return (
                                <tr key={aluno.id} className="border-b last:border-0 align-top">
                                  <td className="p-3">
                                    <div className="font-bold text-gray-800 text-base">{aluno.nome}</div>
                                    
                                    {/* Módulo Expansível de Entregas */}
                                    {envios.length > 0 ? (
                                      <details className="mt-2 group">
                                        <summary className="cursor-pointer text-blue-600 text-xs font-semibold select-none hover:underline">
                                          Ver {envios.length} envio(s) 
                                        </summary>
                                        <div className="mt-3 space-y-3 border-l-2 border-blue-200 pl-3">
                                          {envios.map(envio => (
                                            <div key={envio.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                              <div className="flex justify-between items-start mb-1">
                                                <p className="font-bold text-gray-700 text-sm">{envio.titulo}</p>
                                                <p className="text-[10px] text-gray-400">
                                                  {envio.dataSubmissao.toLocaleDateString('pt-BR')}
                                                </p>
                                              </div>
                                              <p className="text-xs text-gray-600 mb-2 whitespace-pre-wrap">{envio.descricao}</p>
                                              
                                              {envio.arquivos && envio.arquivos.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                                                  {envio.arquivos.map((arq, idx) => (
                                                    <a 
                                                      key={idx} 
                                                      href={arq.url} 
                                                      target="_blank" 
                                                      rel="noopener noreferrer" 
                                                      className="bg-white border border-gray-300 text-blue-600 px-2 py-1 rounded text-[10px] hover:bg-blue-50 transition shadow-sm font-medium"
                                                    >
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
                      <p className="text-sm text-gray-400">Nenhum aluno adicionado a esta turma.</p>
                    )}
                  </div>
                )
              })
            )}
          </section>
        </div>
      </div>
    </main>
  );
}