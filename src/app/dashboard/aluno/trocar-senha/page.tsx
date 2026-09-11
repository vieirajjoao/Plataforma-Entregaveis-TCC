import { atualizarSenhaPrimeiroAcesso } from '@/src/app/actions/auth'
import { createClientSSR } from '@/src/lib/supabase'
import { redirect } from 'next/navigation'

export default async function TrocarSenhaPage() {
  const supabase = await createClientSSR()
  const { data } = await supabase.auth.getUser()

  // Se o aluno não estiver logado, chuta para a tela de login
  if (!data.user) {
    redirect('/login/aluno')
  }

  // Pega o UUID real que o Supabase exige
  const authUserIdReal = data.user.id 
  const formAction = atualizarSenhaPrimeiroAcesso.bind(null, authUserIdReal)

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 border-t-4 border-yellow-400">
        <h1 className="text-xl font-bold text-gray-800 mb-2">Primeiro Acesso</h1>
        <p className="text-sm text-gray-600 mb-6">
          Por questões de segurança, você precisa cadastrar uma nova senha pessoal antes de continuar.
        </p>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
            <input 
              type="password" 
              name="novaSenha" 
              minLength={6}
              required 
              placeholder="Mínimo 6 caracteres"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-yellow-500"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Salvar e Continuar
          </button>
        </form>
      </div>
    </main>
  )
}