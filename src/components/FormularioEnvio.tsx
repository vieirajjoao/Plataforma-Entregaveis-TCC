'use client'

import { useState, useRef } from 'react'
import { submeterAtividade } from '@/src/app/actions/atividades'

export default function FormularioEnvio({ alunoId }: { alunoId: string }) {
  const [aberto, setAberto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmeter(formData: FormData) {
    setEnviando(true)
    try {
      // Chama a Server Action
      await submeterAtividade(formData)
      
      // Limpa os dados e fecha o formulário
      formRef.current?.reset()
      setAberto(false)
    } catch (error) {
      alert('Erro ao enviar: ' + (error as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  // Se estiver fechado, mostra apenas o botão
  if (!aberto) {
    return (
      <button 
        onClick={() => setAberto(true)}
        className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition shadow-sm"
      >
        + Realizar Envio
      </button>
    )
  }

  // Se estiver aberto, mostra o formulário
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-semibold text-gray-800">Novo Envio</h2>
        <button 
          onClick={() => setAberto(false)} 
          className="text-gray-500 hover:text-red-600 text-sm font-medium transition"
        >
          Cancelar
        </button>
      </div>
      
      <form action={handleSubmeter} ref={formRef} className="space-y-4">
        <input type="hidden" name="alunoId" value={alunoId} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título do Envio *</label>
          <input 
            type="text" 
            name="titulo"
            required
            placeholder="Ex: Entrega da Introdução"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
          <textarea 
            name="descricao"
            required
            rows={4}
            placeholder="Descreva o conteúdo deste envio..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Arquivos Anexos (Pode selecionar vários)
          </label>
          <input 
            type="file" 
            name="arquivos"
            multiple 
            accept=".pdf,.doc,.docx,.txt,.md,.jpeg,.jpg,.png"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-lg p-1"
          />
        </div>

        <button 
          type="submit" 
          disabled={enviando}
          className={`font-semibold py-3 px-6 rounded-lg transition w-full md:w-auto text-white ${
            enviando ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {enviando ? 'Enviando...' : 'Confirmar Envio'}
        </button>
      </form>
    </section>
  )
}