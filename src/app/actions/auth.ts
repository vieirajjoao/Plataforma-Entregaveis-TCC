'use server'

import { db } from '@/src/db'
import { alunos } from '@/src/db/schemas/alunos'
import { professores } from '@/src/db/schemas/professores'
import { getAlunoAutenticado } from '@/src/lib/auth'
import { createAdminClient, createClientSSR } from '@/src/lib/supabase'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export type AuthActionState = { message: string } | null

export async function loginProfessor(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = (formData.get('email') as string | null)?.trim() ?? ''
  const password = (formData.get('password') as string | null) ?? ''

  const supabase = await createClientSSR()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return { message: 'E-mail ou senha incorretos.' }
  }

  redirect('/dashboard/professores')
}

export async function loginAluno(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const username = (formData.get('username') as string | null)?.trim().toLowerCase() ?? ''
  const password = (formData.get('password') as string | null) ?? ''
  const emailFantasma = `${username}@portal.local`

  const supabase = await createClientSSR()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailFantasma,
    password,
  })

  if (error || !data.user) {
    return { message: 'Login ou senha incorretos.' }
  }

  const [aluno] = await db
    .select()
    .from(alunos)
    .where(eq(alunos.authUserId, data.user.id))
    .limit(1)

  if (!aluno) {
    await supabase.auth.signOut()
    return { message: 'Perfil de aluno não encontrado.' }
  }

  if (!aluno.ativo) {
    await supabase.auth.signOut()
    return { message: 'Sua conta foi desativada pelo professor.' }
  }

  if (aluno.precisaTrocarSenha) {
    redirect('/dashboard/aluno/trocar-senha')
  }

  redirect('/dashboard/aluno')
}

export async function atualizarSenhaPrimeiroAcesso(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const aluno = await getAlunoAutenticado()

  if (!aluno || !aluno.ativo || !aluno.authUserId) {
    return { message: 'Sessão inválida. Faça login novamente.' }
  }

  const password = (formData.get('password') as string | null) ?? ''

  if (password.length < 6) {
    return { message: 'A senha deve ter pelo menos 6 caracteres.' }
  }

  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin.auth.admin.updateUserById(aluno.authUserId, {
    password,
  })

  if (error) {
    return { message: 'Erro ao atualizar a senha. Tente novamente.' }
  }

  await db
    .update(alunos)
    .set({ senhaTemporaria: null, precisaTrocarSenha: false })
    .where(eq(alunos.id, aluno.id))

  redirect('/dashboard/aluno')
}

export async function logout() {
  const supabase = await createClientSSR()
  await supabase.auth.signOut()
  redirect('/')
}

export async function cadastrarProfessor(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const nome = (formData.get('nome') as string | null)?.trim() ?? ''
  const email = (formData.get('email') as string | null)?.trim() ?? ''
  const password = (formData.get('password') as string | null) ?? ''

  if (!nome || !email || password.length < 6) {
    return { message: 'Preencha todos os campos corretamente.' }
  }

  const supabase = await createClientSSR()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) return { message: 'Erro ao criar conta: ' + error.message }
  if (!data.user) return { message: 'Falha ao gerar usuário.' }

  try {
    await db.insert(professores).values({
      nome,
      email,
      authUserId: data.user.id,
    })
  } catch (err) {
    console.error('Erro ao salvar professor no banco:', err)
    return { message: 'Erro ao salvar os dados do professor.' }
  }

  redirect('/dashboard/professores')
}