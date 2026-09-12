'use server'

import { db } from '@/src/db'
import { alunos } from '@/src/db/schemas/alunos'
import { createClient } from '@supabase/supabase-js'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import {getSessaoAtual} from '@/src/lib/auth'

// Usa a Service Role Key para ter permissão de Admin (criar usuários sem confirmação de e-mail)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
)

function gerarLogin(nome: string, idAleatorio: string) {
  const partes = nome.trim().toLowerCase().split(' ')
  const base = partes.length > 1 ? `${partes[0]}.${partes[partes.length - 1]}` : partes[0]
  const loginLimpo = base.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return `${loginLimpo}${idAleatorio}`
}

export async function adicionarAluno(formData: FormData) {
  try {
    const turmaId = formData.get('turmaId') as string
    const nome = formData.get('nome') as string
    const idade = parseInt(formData.get('idade') as string)
    
    // Gera o login internamente (Ex: joao.845) sem depender de funções externas
    const primeiroNome = nome.split(' ')[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const idAleatorio = Math.floor(100 + Math.random() * 900).toString()
    const login = `${primeiroNome}.${idAleatorio}`
    
    const emailFantasma = `${login}@portal.local`
    const senhaTemporaria = Math.random().toString(36).slice(-6).toUpperCase()

    // 1. Cria no Supabase
    const { data: authData, error } = await supabaseAdmin.auth.admin.createUser({
      email: emailFantasma,
      password: senhaTemporaria,
      email_confirm: true,
    })

    if (error) {
      return { success: false, error: 'Erro no servidor de contas: ' + error.message }
    }

    if (!authData.user) {
      return { success: false, error: 'Falha desconhecida ao criar usuário no Supabase.' }
    }

    // 2. Salva no Drizzle
    await db.insert(alunos).values({
      nome, 
      idade, 
      login, 
      senhaTemporaria, 
      precisaTrocarSenha: true,
      turmaId, 
      authUserId: authData.user.id
    })

    // 3. Revalida a tela
    revalidatePath('/dashboard/professor')
    return { success: true, error: null }

  } catch (err) {
    // Se estourar QUALQUER erro (banco de dados, variável nula, etc), cai aqui!
    console.error("Erro CRÍTICO ao adicionar aluno:", err)
    return { 
      success: false, 
      error: 'Erro interno no banco de dados. Tente novamente.' 
    }
  }
}

export async function resetarSenhaAluno(alunoId: string, authUserId: string) {
  const novaSenhaTemporaria = Math.random().toString(36).slice(-6).toUpperCase()

  await supabaseAdmin.auth.admin.updateUserById(authUserId, {
    password: novaSenhaTemporaria
  })

  await db.update(alunos)
    .set({ senhaTemporaria: novaSenhaTemporaria, precisaTrocarSenha: true })
    .where(eq(alunos.id, alunoId))

  revalidatePath('/dashboard/professor')
}

export async function inativarAluno(alunoId: string) {
  // Apenas muda o status para falso. Não apagamos as atividades e nem o Auth!
  await db.update(alunos)
    .set({ ativo: false })
    .where(eq(alunos.id, alunoId))

  revalidatePath('/dashboard/professor')
}

export async function restaurarAluno(alunoId: string) {
  // Retorna o status do aluno para ativo, permitindo o login novamente
  await db.update(alunos)
    .set({ ativo: true })
    .where(eq(alunos.id, alunoId))

  revalidatePath('/dashboard/professor')
}