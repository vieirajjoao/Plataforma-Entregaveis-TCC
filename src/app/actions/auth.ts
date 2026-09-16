'use server'

import { db } from '@/src/db'
import { alunos } from '@/src/db/schemas/alunos'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import  {professores} from '@/src/db/schemas/professores'
// Importa o cliente com cookies para o login normal
import { createClientSSR } from '@/src/lib/supabase' 
// Importa o cliente padrão para usarmos como Admin
import { createClient } from '@supabase/supabase-js'

export async function loginProfessor(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string // Alterado para buscar 'password'

  const supabase = await createClientSSR()
  const { data, error } = await supabase.auth.signInWithPassword({ 
    email, 
    password // Repassando a variável correta
  })

  // Se der erro, retorna o objeto com a mensagem em vez de quebrar a tela
  if (error || !data.user) {
    return { message: 'E-mail ou senha incorretos.' }
  }

  redirect('/dashboard/professores')
}

export async function loginAluno(prevState: any, formData: FormData) {
  const username = formData.get('username') as string // Alterado para buscar 'username'
  const password = formData.get('password') as string // Alterado para buscar 'password'
  const emailFantasma = `${username}@portal.local`

  const supabase = await createClientSSR()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailFantasma,
    password: password,
  })

  if (error || !data.user) {
    return { message: 'Login ou senha incorretos.' }
  }

  const resultadoBusca = await db.select().from(alunos).where(eq(alunos.authUserId, data.user.id)).limit(1)
  const aluno = resultadoBusca[0]

  if (aluno && aluno.ativo === false) {
    await supabase.auth.signOut()
    return { message: 'Sua conta foi desativada pelo professor.' }
  }

  if (aluno?.precisaTrocarSenha) {
    redirect('/dashboard/aluno/trocar-senha')
  } else {
    redirect('/dashboard/aluno')
  }
}

export async function atualizarSenhaPrimeiroAcesso(prevState: any, formData: FormData) {
  const authUserId = formData.get('authUserId') as string
  const password = formData.get('password') as string

  if (!password || password.length < 6) {
    return { message: 'A senha deve ter pelo menos 6 caracteres.' }
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  const { error } = await supabaseAdmin.auth.admin.updateUserById(authUserId, { password })

  if (error) {
    return { message: 'Erro ao atualizar a senha: ' + error.message }
  }

  await db.update(alunos)
    .set({ senhaTemporaria: null, precisaTrocarSenha: false })
    .where(eq(alunos.authUserId, authUserId))

  redirect('/dashboard/aluno')
}
export async function logout() {
  const supabase = await createClientSSR()
  await supabase.auth.signOut()
  redirect('/') // Manda de volta para a tela inicial
}


export async function cadastrarProfessor(prevState: any, formData: FormData) {
  const nome = formData.get('nome') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClientSSR()

  // 1. Cria a conta no Supabase Auth
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) return { message: 'Erro ao criar conta: ' + error.message }
  if (!data.user) return { message: 'Falha ao gerar usuário.' }

  // 2. Registra o professor no banco de dados (Drizzle)
  try {
    await db.insert(professores).values({
      nome,
      email,
      authUserId: data.user.id
    })
  } catch (err) {
    return { message: 'Erro ao salvar os dados do professor.' }
  }

  // Se tudo der certo, manda para o dashboard
  redirect('/dashboard/professores')
}