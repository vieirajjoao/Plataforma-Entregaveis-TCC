'use client'

import { useState, useTransition } from 'react'
import { resetarSenhaAluno, inativarAluno } from '@/src/app/actions/alunos'

export default function BotaoAcoesAluno({ alunoId, authUserId }: { alunoId: string, authUserId: string | null }) {
  const [isPending, startTransition] = useTransition()
  const [acao, setAcao] = useState<'resetar' | 'remover' | null>(null)

  function handleResetar() {
    setAcao('resetar')
    startTransition(async () => {
      await resetarSenhaAluno(alunoId, authUserId)
      setAcao(null)
    })
  }

  function handleRemover() {
    if (!window.confirm('Remover este aluno da turma?')) return
    setAcao('remover')
    startTransition(async () => {
      await inativarAluno(alunoId)
      setAcao(null)
    })
  }

  return (
    <div className="flex flex-col gap-2 items-end">
      <button onClick={handleResetar} disabled={isPending} className="text-yellow-600 hover:bg-yellow-50 px-3 py-1 rounded text-xs font-semibold transition border border-gray-200 shadow-sm disabled:opacity-50">
        {isPending && acao === 'resetar' ? 'Processando...' : 'Resetar Senha'}
      </button>
      <button onClick={handleRemover} disabled={isPending} className="text-red-500 hover:bg-red-50 px-3 py-1 rounded text-xs font-semibold transition border border-gray-200 shadow-sm disabled:opacity-50">
        {isPending && acao === 'remover' ? 'Processando...' : 'Remover Aluno'}
      </button>
    </div>
  )
}