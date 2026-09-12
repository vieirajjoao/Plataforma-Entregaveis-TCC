'use client'

import { useState, useRef } from 'react'
import { adicionarAluno } from '@/src/app/actions/alunos'

export default function FormularioNovoAluno({ turmaId }: { turmaId: string }) {
  const [salvando, setSalvando] = useState(false)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleAdicionar(formData: FormData) {
    setSalvando(true)
    setMensagemErro(null)
    
    const resposta = await adicionarAluno(formData)
    
    if (resposta?.error) {
      setMensagemErro(resposta.error)
    } else {
      formRef.current?.reset()
    }
    
    setSalvando(false)
  }

  return (
    <div className="mb-6">
      {mensagemErro && (
        <div className="mb-2 p-2 bg-red-50 text-red-600 rounded text-xs font-semibold border border-red-200">
          {mensagemErro}
        </div>
      )}
      <form action={handleAdicionar} ref={formRef} className="flex flex-wrap gap-2 items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <input type="hidden" name="turmaId" value={turmaId} />
        <input type="text" name="nome" placeholder="Nome do Aluno" required className="border p-2 rounded text-sm flex-1 min-w-[200px]" />
        <input type="number" name="idade" placeholder="Idade" required className="border p-2 rounded text-sm w-24" />
        <button type="submit" disabled={salvando} className={`text-white px-4 py-2 rounded text-sm font-semibold transition ${salvando ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {salvando ? 'Adicionando...' : '+ Adicionar Aluno'}
        </button>
      </form>
    </div>
  )
}