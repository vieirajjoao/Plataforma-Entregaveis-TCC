import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Portal TCC</h1>
        <p className="text-gray-500 mb-8">Acompanhamento e entrega de atividades semanais.</p>
        
        <div className="flex flex-col gap-4">
          <Link 
            href="/login/aluno"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Entrar como Aluno
          </Link>
          <Link 
            href="/login/professor"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Entrar como Professor
          </Link>
        </div>
      </div>
    </main>
  );
}