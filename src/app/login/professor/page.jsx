import { loginProfessor } from '@/src/app/actions/auth'

export default function LoginProfessor() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border-t-4 border-emerald-600">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Acesso do Professor</h1>
        
        <form action={loginProfessor} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seu E-mail</label>
            <input 
              type="email" 
              name="email" 
              placeholder="professor@ufu.br" 
              required 
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input 
              type="password" 
              name="senha" 
              required 
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-emerald-500"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors mt-4"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </main>
  )
}