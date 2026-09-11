'use client'

import { useState, useRef } from 'react'
import { criarTurma } from '@/src/app/actions/turmas'

export default function FormularioNovaTurma({ professorId }: { professorId: string }) {
  const [aberto, setAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSalvar(formData: FormData) {
    setSalvando(true)
    try {
      await criarTurma(formData)
      formRef.current?.reset()
      setAberto(false)
    } catch (error) {
      alert('Erro ao criar turma: ' + (error as Error).message)
    } finally {
      setSalvando(false)
    }
  }

  if (!aberto) {
    return (
      <button 
        onClick={() => setAberto(true)} 
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-sm"
      >
        + Criar Nova Turma
      </button>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 w-full max-w-md text-left">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="font-semibold text-lg text-gray-800">Criar Nova Turma</h2>
        <button onClick={() => setAberto(false)} className="text-gray-400 hover:text-red-600 text-sm font-medium">
          ✕ Cancelar
        </button>
      </div>
      
      <form action={handleSalvar} ref={formRef} className="space-y-4 text-sm">
        <input type="hidden" name="professorId" value={professorId} />
        
        <div>
          <label className="block text-gray-600 mb-1 text-xs font-semibold">Nome da Turma</label>
          <input type="text" name="nome" placeholder="Ex: TCC 1 - Seg 19h" required className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-emerald-500" />
        </div>

        <div>
          <label className="block text-gray-600 mb-1 text-xs font-semibold">Sala / Local</label>
          <input type="text" name="sala" placeholder="Ex: Bloco 1B - Sala 204" required className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-emerald-500" />
        </div>
        
        <button type="submit" disabled={salvando} className={`w-full text-white font-semibold py-3 rounded-lg mt-2 transition ${salvando ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
          {salvando ? 'Salvando...' : 'Confirmar Criação'}
        </button>
      </form>
    </div>
  )
}