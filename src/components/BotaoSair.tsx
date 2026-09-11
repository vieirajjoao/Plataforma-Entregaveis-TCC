'use client'

import { useTransition } from 'react'
import { logout } from '@/src/app/actions/auth'

export default function BotaoSair() {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
      className={`text-sm font-semibold px-4 py-2 rounded-lg border transition-colors ${
        isPending 
          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
          : 'bg-white text-gray-600 border-gray-300 hover:text-red-600 hover:border-red-200 hover:bg-red-50'
      }`}
    >
      {isPending ? 'Saindo...' : 'Sair'}
    </button>
  )
}