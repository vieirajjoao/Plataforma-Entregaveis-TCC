'use server'

import { randomBytes, randomInt } from 'node:crypto'
import { db } from '@/src/db'
import { alunos } from '@/src/db/schemas/alunos'
import { turmas } from '@/src/db/schemas/turmas'
import { getProfessorAutenticado } from '@/src/lib/auth'
import { createAdminClient } from '@/src/lib/supabase'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

function gerarSenhaTemporaria() {
  return randomBytes(6).toString('base64url').slice(0, 8)
}

async function verificarAlunoDoProfessor(alunoId: string, professorId: string) {
  const [registro] = await db
    .select({
      id: alunos.id,
      authUserId: alunos.authUserId,
    })
    .from(alunos)
    .innerJoin(turmas, eq(alunos.turmaId, turmas.id))
    .where(and(eq(alunos.id, alunoId), eq(turmas.professorId, professorId)))
    .limit(1)

  return registro ?? null
}

export async function adicionarAluno(formData: FormData) {
  const professor = await getProfessorAutenticado()

  if (!professor) {
    return { success: false, error: 'Não autorizado.' }
  }

  const turmaId = (formData.get('turmaId') as string | null)?.trim() ?? ''
  const nome = (formData.get('nome') as string | null)?.trim() ?? ''
  const idade = parseInt((formData.get('idade') as string | null) ?? '', 10)

  if (!turmaId || !nome || Number.isNaN(idade) || idade <= 0) {
    return { success: false, error: 'Preencha corretamente os dados do aluno.' }
  }

  const [turma] = await db
    .select({ id: turmas.id })
    .from(turmas)
    .where(and(eq(turmas.id, turmaId), eq(turmas.professorId, professor.id)))
    .limit(1)

  if (!turma) {
    return { success: false, error: 'Turma não encontrada ou sem permissão.' }
  }

  const primeiroNome = nome
    .split(/\s+/)[0]
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')

  const idAleatorio = randomInt(100, 1000).toString()
  const login = `${primeiroNome || 'aluno'}.${idAleatorio}`
  const emailFantasma = `${login}@portal.local`
  const senhaTemporaria = gerarSenhaTemporaria()

  const supabaseAdmin = createAdminClient()
  let authUserIdCriado: string | null = null

  try {
    const { data: authData, error } = await supabaseAdmin.auth.admin.createUser({
      email: emailFantasma,
      password: senhaTemporaria,
      email_confirm: true,
    })

    if (error || !authData.user) {
      return { success: false, error: 'Erro ao criar credenciais do aluno.' }
    }

    authUserIdCriado = authData.user.id

    await db.insert(alunos).values({
      nome,
      idade,
      login,
      senhaTemporaria,
      precisaTrocarSenha: true,
      turmaId,
      authUserId: authUserIdCriado,
    })

    revalidatePath('/dashboard/professores')
    return { success: true, error: null }
  } catch (err) {
    console.error('Erro ao adicionar aluno:', err)
    if (authUserIdCriado) {
      await supabaseAdmin.auth.admin.deleteUser(authUserIdCriado)
    }
    return {
      success: false,
      error: 'Erro interno ao cadastrar aluno. Tente novamente.',
    }
  }
}

export async function resetarSenhaAluno(alunoId: string) {
  const professor = await getProfessorAutenticado()
  if (!professor) return

  const aluno = await verificarAlunoDoProfessor(alunoId, professor.id)
  if (!aluno) return

  try {
    const novaSenhaTemporaria = gerarSenhaTemporaria()

    if (aluno.authUserId) {
      const supabaseAdmin = createAdminClient()
      const { error } = await supabaseAdmin.auth.admin.updateUserById(aluno.authUserId, {
        password: novaSenhaTemporaria,
      })

      if (error) {
        console.error('Erro ao redefinir senha no provedor:', error.message)
        return
      }
    }

    await db
      .update(alunos)
      .set({
        senhaTemporaria: novaSenhaTemporaria,
        precisaTrocarSenha: true,
      })
      .where(eq(alunos.id, aluno.id))

    revalidatePath('/dashboard/professores')
  } catch (err) {
    console.error('Erro ao resetar senha:', err)
  }
}

export async function inativarAluno(alunoId: string) {
  const professor = await getProfessorAutenticado()
  if (!professor) return

  const aluno = await verificarAlunoDoProfessor(alunoId, professor.id)
  if (!aluno) return

  await db
    .update(alunos)
    .set({ ativo: false })
    .where(eq(alunos.id, aluno.id))

  revalidatePath('/dashboard/professores')
}

export async function restaurarAluno(alunoId: string): Promise<void> {
  const professor = await getProfessorAutenticado()
  if (!professor) return

  const aluno = await verificarAlunoDoProfessor(alunoId, professor.id)
  if (!aluno) return

  await db
    .update(alunos)
    .set({ ativo: true })
    .where(eq(alunos.id, aluno.id))

  revalidatePath('/dashboard/professores')
}