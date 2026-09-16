'use client'

import { useState, useTransition } from 'react'
import { resetarSenhaAluno, inativarAluno } from '@/src/app/actions/alunos'

export default function BotaoAcoesAluno({ alunoId, authUserId }: { alunoId: string, authUserId: string | null }) {
  const [isPending, startTransition] = useTransition()
  const [acaoAtual, setAcaoAtual] = useState<'resetar' | 'remover' | null>(null)

  function handleResetar() {
    setAcaoAtual('resetar')
    startTransition(async () => {
      await resetarSenhaAluno(alunoId, authUserId)
      setAcaoAtual(null)
    })
  }

  function handleRemover() {
    if (!window.confirm('Tem certeza que deseja remover este aluno da turma?')) return
    
    setAcaoAtual('remover')
    startTransition(async () => {
      await inativarAluno(alunoId)
      setAcaoAtual(null)
    })
  }

  return (
    <div className="flex flex-col gap-2 items-end">
      <button
        onClick={handleResetar}
        disabled={isPending}
        className="text-yellow-600 hover:bg-yellow-50 px-3 py-1 rounded text-xs font-semibold transition border border-gray-200 shadow-sm disabled:opacity-50"
      >
        {isPending && acaoAtual === 'resetar' ? 'Resetando...' : 'Resetar Senha'}
      </button>
      
      <button
        onClick={handleRemover}
        disabled={isPending}
        className="text-red-500 hover:bg-red-50 px-3 py-1 rounded text-xs font-semibold transition border border-gray-200 shadow-sm disabled:opacity-50"
      >
        {isPending && acaoAtual === 'remover' ? 'Removendo...' : 'Remover Aluno'}
      </button>
    </div>
  )
}