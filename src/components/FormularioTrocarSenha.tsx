'use client'

import { useActionState, useState } from 'react'
import { atualizarSenhaPrimeiroAcesso } from '@/src/app/actions/auth'

export default function FormularioTrocarSenha({ authUserId }: { authUserId: string }) {
  const [state, formAction, isPending] = useActionState(atualizarSenhaPrimeiroAcesso, null)
  const [mostrarSenha, setMostrarSenha] = useState(false)

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 border-t-4 border-yellow-400">
      <h1 className="text-xl font-bold text-gray-800 mb-2">Primeiro Acesso</h1>
      <p className="text-sm text-gray-600 mb-6">
        Por questões de segurança, crie uma nova senha pessoal.
      </p>

      {state?.message && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-semibold border border-red-200">
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="authUserId" value={authUserId} />

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
          <div className="relative">
            <input 
              id="password"
              type={mostrarSenha ? "text" : "password"} 
              name="password" 
              autoComplete="new-password"
              required 
              placeholder="Mínimo 6 caracteres"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-yellow-500"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 font-medium text-sm"
            >
              {mostrarSenha ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isPending}
          className={`w-full text-white font-semibold py-3 rounded-lg transition-colors ${
            isPending ? 'bg-yellow-400' : 'bg-yellow-500 hover:bg-yellow-600'
          }`}
        >
          {isPending ? 'Salvando...' : 'Salvar e Continuar'}
        </button>
      </form>
    </div>
  )
}