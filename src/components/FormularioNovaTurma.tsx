'use client'

import { useState, useRef } from 'react'
import { criarTurma } from '@/src/app/actions/turmas'

export default function FormularioNovaTurma() {
  const [aberto, setAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSalvar(formData: FormData) {
    setSalvando(true)
    setMensagemErro(null)
    try {
      const resposta = await criarTurma(formData)

      if (!resposta?.success) {
        setMensagemErro(resposta?.error ?? 'Erro ao criar turma.')
        return
      }

      formRef.current?.reset()
      setAberto(false)
    } catch {
      setMensagemErro('Erro inesperado ao criar turma.')
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
        <button
          onClick={() => {
            setMensagemErro(null)
            setAberto(false)
          }}
          className="text-gray-400 hover:text-red-600 text-sm font-medium"
        >
          ✕ Cancelar
        </button>
      </div>

      {mensagemErro && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-semibold border border-red-200">
          {mensagemErro}
        </div>
      )}

      <form action={handleSalvar} ref={formRef} className="space-y-4 text-sm">
        <div>
          <label className="block text-gray-600 mb-1 text-xs font-semibold">Nome da Turma</label>
          <input
            type="text"
            name="nome"
            placeholder="Ex: TCC 1 - Seg 19h"
            required
            className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1 text-xs font-semibold">Sala / Local</label>
          <input
            type="text"
            name="sala"
            placeholder="Ex: Bloco 1B - Sala 204"
            required
            className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={salvando}
          className={`w-full text-white font-semibold py-3 rounded-lg mt-2 transition ${
            salvando ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {salvando ? 'Salvando...' : 'Confirmar Criação'}
        </button>
      </form>
    </div>
  )
}