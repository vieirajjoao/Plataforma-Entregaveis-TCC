'use client'

import { useActionState } from 'react'
import { loginProfessor } from '@/src/app/actions/auth'

export default function LoginProfessor() {
  // Hook do React para gerenciar o estado da Server Action
  const [state, formAction, isPending] = useActionState(loginProfessor, null)

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border-t-4 border-emerald-600">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Acesso do Professor</h1>
        
        {/* EXIBIÇÃO DE ERRO ELEGANTE */}
        {state?.message && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-semibold text-center">
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Seu E-mail</label>
            <input 
              id="email"
              type="email" 
              name="email" 
              autoComplete="username email" 
              placeholder="professor@ufu.br" 
              required 
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input 
              id="password"
              type="password" 
              name="password" 
              autoComplete="current-password" 
              required 
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-emerald-500"
            />
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className={`w-full text-white font-semibold py-3 rounded-lg mt-4 transition-colors ${
              isPending ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isPending ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>
      </div>
    </main>
  )
}