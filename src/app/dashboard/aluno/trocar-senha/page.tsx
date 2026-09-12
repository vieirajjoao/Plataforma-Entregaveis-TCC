import { createClientSSR } from '@/src/lib/supabase'
import { redirect } from 'next/navigation'
import FormularioTrocarSenha from '@/src/components/FormularioTrocarSenha'

export default async function TrocarSenhaPage() {
  const supabase = await createClientSSR()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login/aluno')

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <FormularioTrocarSenha authUserId={user.id} />
    </main>
  )
}