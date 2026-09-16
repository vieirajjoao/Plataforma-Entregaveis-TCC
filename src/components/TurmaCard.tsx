import FormularioNovoAluno from '@/src/components/FormularioNovoAluno'
import LinhaAluno from '@/src/components/LinhaAluno'
import { restaurarAluno } from '@/src/app/actions/alunos'

export default function TurmaCard({ turma, alunosAtivos, alunosInativos, atividades }: { turma: any, alunosAtivos: any[], alunosInativos: any[], atividades: any[] }) {
  return (
    <details className="bg-white rounded-xl shadow-sm border border-gray-200 group overflow-hidden">
      
      {/* CABEÇALHO DA TURMA */}
      <summary className="p-6 cursor-pointer list-none flex justify-between items-center hover:bg-gray-50 transition">
        <div>
          <h2 className="text-xl font-bold text-gray-800 group-open:text-emerald-700 transition-colors">{turma.nome}</h2>
          <p className="text-sm text-gray-500 mt-1">Sala: {turma.sala}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-gray-200 px-3 py-1 rounded-full text-gray-700 font-medium">
            {alunosAtivos.length} Alunos
          </span>
          <span className="text-gray-400 group-open:rotate-180 transition-transform duration-300">▼</span>
        </div>
      </summary>

      <div className="p-6 pt-0 border-t border-gray-100 bg-gray-50/50">
        
        {/* FORMULÁRIO DE NOVO ALUNO */}
        <div className="my-6">
          <FormularioNovoAluno turmaId={turma.id} />
        </div>

        {/* TABELA DE ALUNOS ATIVOS */}
        {alunosAtivos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm bg-white rounded-lg border border-gray-200">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 rounded-tl-lg">Aluno & Entregas</th>
                  <th className="p-3">Login</th>
                  <th className="p-3">Acesso</th>
                  <th className="p-3 rounded-tr-lg text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {alunosAtivos.map(aluno => {
                  const envios = atividades.filter(e => e.alunoId === aluno.id)
                  return <LinhaAluno key={aluno.id} aluno={aluno} envios={envios} />
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Nenhum aluno ativo nesta turma.</p>
        )}

        {/* ALUNOS ARQUIVADOS */}
        {alunosInativos.length > 0 && (
          <details className="mt-6 border-t border-gray-200 pt-4 group/inativos">
            <summary className="cursor-pointer text-gray-500 hover:text-gray-700 text-sm font-semibold select-none flex items-center gap-2">
              <span>Alunos Arquivados ({alunosInativos.length})</span>
              <span className="text-[10px] group-open/inativos:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-4 space-y-3 pl-2 border-l-2 border-gray-200">
              {alunosInativos.map(alunoInativo => {
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
}