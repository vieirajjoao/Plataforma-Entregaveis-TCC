import { getAlunoAutenticado } from '@/src/lib/auth'
import { redirect } from 'next/navigation'
import FormularioTrocarSenha from '@/src/components/FormularioTrocarSenha'

export default async function TrocarSenhaPage() {
  const aluno = await getAlunoAutenticado()

  if (!aluno || !aluno.ativo) redirect('/login/aluno')
  if (!aluno.precisaTrocarSenha) redirect('/dashboard/aluno')

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <FormularioTrocarSenha />
    </main>
  )
}