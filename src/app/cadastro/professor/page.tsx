'use client'

import { useActionState } from 'react'
import { cadastrarProfessor } from '@/src/app/actions/auth'
import Link from 'next/link'

export default function CadastroProfessor() {
  const [state, formAction, isPending] = useActionState(cadastrarProfessor, null)

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border-t-4 border-emerald-600">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Novo Professor</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Crie sua conta para gerenciar turmas.</p>
        
        {state?.message && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-semibold text-center border border-red-200">
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input type="text" name="nome" required className="w-full border p-3 rounded-lg outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input type="email" name="email" autoComplete="username" required className="w-full border p-3 rounded-lg outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" name="password" autoComplete="new-password" required minLength={6} className="w-full border p-3 rounded-lg outline-none focus:border-emerald-500" />
          </div>

          <button type="submit" disabled={isPending} className={`w-full text-white font-semibold py-3 rounded-lg mt-4 transition-colors ${isPending ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
            {isPending ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link href="/login/professor" className="text-sm text-emerald-600 hover:underline font-medium">
            Já tem uma conta? Faça login
          </Link>
        </div>
      </div>
    </main>
  )
}