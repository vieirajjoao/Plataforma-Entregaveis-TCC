import BotaoAcoesAluno from './BotaoAcoesAluno'

export default function LinhaAluno({ aluno, envios }: { aluno: any, envios: any[] }) {
  return (
    <tr className="border-b last:border-0 align-top hover:bg-gray-50 transition-colors">
      <td className="p-3 w-1/2">
        <div className="font-bold text-gray-800 text-base mb-1">{aluno.nome}</div>
        {envios.length > 0 ? (
          <details className="mt-2 group/envios">
            <summary className="cursor-pointer text-blue-600 text-xs font-semibold hover:underline">Ver {envios.length} envio(s)</summary>
            <div className="mt-3 space-y-3 border-l-2 border-blue-200 pl-3">
              {envios.map(envio => (
                <div key={envio.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <p className="font-bold text-gray-700 text-sm">{envio.titulo}</p>
                  <p className="text-xs text-gray-600 mb-2">{envio.descricao}</p>
                  {envio.arquivos && envio.arquivos.length > 0 && (
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      {envio.arquivos.map((arq: any, idx: number) => (
                        <a key={idx} href={arq.url} target="_blank" rel="noreferrer" className="text-blue-600 px-2 py-1 bg-gray-50 rounded text-[10px] font-medium border border-gray-200">
                          📎 {arq.nome}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </details>
        ) : <p className="text-xs text-gray-400 italic">Nenhum envio.</p>}
      </td>
      <td className="p-3 text-gray-600 font-mono align-middle">{aluno.login}</td>
      <td className="p-3 align-middle">
        {aluno.precisaTrocarSenha ? (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-mono font-bold">{aluno.senhaTemporaria}</span>
        ) : (
          <span className="text-emerald-600 text-xs font-semibold">Definida pelo aluno</span>
        )}
      </td>
      <td className="p-3 align-middle">
        <BotaoAcoesAluno alunoId={aluno.id} authUserId={aluno.authUserId} />
      </td>
    </tr>
  )
}