'use server'

import { db } from '@/src/db'
import { alunos } from '@/src/db/schemas/alunos'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

// Importa o cliente com cookies para o login normal
import { createClientSSR } from '@/src/lib/supabase' 
// Importa o cliente padrão para usarmos como Admin
import { createClient } from '@supabase/supabase-js'

export async function loginAluno(formData: FormData) {
  const login = formData.get('login') as string
  const senha = formData.get('senha') as string
  const emailFantasma = `${login}@portal.local`

  const supabase = await createClientSSR() // <-- Usa o novo cliente com cookies
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailFantasma,
    password: senha,
  })

  if (error || !data.user) throw new Error('Credenciais inválidas.')

  const resultadoBusca = await db.select().from(alunos).where(eq(alunos.authUserId, data.user.id)).limit(1)
  const aluno = resultadoBusca[0]

  // BLOQUEIO: Se o aluno existir, mas estiver inativo, destrói a sessão e bloqueia
  if (aluno && aluno.ativo === false) {
    await supabase.auth.signOut()
    throw new Error('Esta conta foi desativada pelo professor.')
  }

  if (aluno?.precisaTrocarSenha) {
    redirect('/dashboard/aluno/trocar-senha')
  } else {
    redirect('/dashboard/aluno')
  }
}

export async function loginProfessor(formData: FormData) {
  const email = formData.get('email') as string
  const senha = formData.get('senha') as string

  const supabase = await createClientSSR() // <-- Atualize aqui também
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })

  if (error || !data.user) throw new Error('E-mail ou senha inválidos.')
  redirect('/dashboard/professores')
}

export async function atualizarSenhaPrimeiroAcesso(authUserId: string, formData: FormData) {
  const novaSenha = formData.get('novaSenha') as string
  
  // AQUI USAMOS O CREATECLIENT PADRÃO!
  // Pois precisamos da chave Service Role (Admin) para pular as regras de segurança
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  // Como estamos usando o admin, ele tem permissão para alterar a senha direto pelo ID
  await supabaseAdmin.auth.admin.updateUserById(authUserId, { password: novaSenha })

  // Atualiza a flag e apaga a senha temporária no nosso banco Drizzle
  await db.update(alunos)
    .set({ 
      senhaTemporaria: null, 
      precisaTrocarSenha: false 
    })
    .where(eq(alunos.authUserId, authUserId))

  redirect('/dashboard/aluno')
}