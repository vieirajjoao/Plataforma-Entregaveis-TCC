'use client'

import { useActionState } from 'react'
import { loginAluno } from '@/src/app/actions/auth'

export default function LoginAluno() {
  const [state, formAction, isPending] = useActionState(loginAluno, null)

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-600">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Portal do Aluno</h1>
        
        {state?.message && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-semibold text-center">
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Login (Gerado pelo Professor)</label>
            <input 
              id="username"
              type="text" 
              name="username" 
              autoComplete="username"
              placeholder="Ex: joao.123"
              required 
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500"
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
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500"
            />
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className={`w-full text-white font-semibold py-3 rounded-lg mt-4 transition-colors ${
              isPending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isPending ? 'Verificando...' : 'Acessar'}
          </button>
        </form>
      </div>
    </main>
  )
}