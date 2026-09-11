import { loginAluno } from '@/src/app/actions/auth'

export default function LoginAluno() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Acesso do Aluno</h1>
        
        <form action={loginAluno} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seu Login</label>
            <input 
              type="text" 
              name="login" 
              placeholder="ex: joao.silva482" 
              required 
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input 
              type="password" 
              name="senha" 
              required 
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors mt-4"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  )
}