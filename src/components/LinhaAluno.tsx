import BotaoAcoesAluno from '@/src/components/BotaoAcoesAlunos'

export default function LinhaAluno({ aluno, envios }: { aluno: any, envios: any[] }) {
  return (
    <tr className="border-b last:border-0 align-top hover:bg-gray-50 transition-colors">
      {/* 1. COLUNA: NOME E ENVIOS */}
      <td className="p-3">
        <div className="font-bold text-gray-800 text-base mb-1">{aluno.nome}</div>

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
                      {envio.arquivos.map((arq: any, idx: number) => (
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
          <p className="text-xs text-gray-400 italic">Nenhum envio.</p>
        )}
      </td>

      {/* 2. COLUNA: LOGIN */}
      <td className="p-3 text-gray-600 font-mono align-middle">{aluno.login}</td>
      
      {/* 3. COLUNA: ACESSO INICIAL */}
      <td className="p-3 align-middle">
        {aluno.precisaTrocarSenha ? (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-mono font-bold">
            {aluno.senhaTemporaria}
          </span>
        ) : (
          <span className="text-emerald-600 text-xs font-semibold">Definida</span>
        )}
      </td>

      {/* 4. COLUNA: AÇÕES (Agora usando o componente seguro) */}
      <td className="p-3 align-middle text-right">
        <BotaoAcoesAluno alunoId={aluno.id} authUserId={aluno.authUserId} />
      </td>
    </tr>
  )
}