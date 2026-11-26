'use server'

import { db } from '@/src/db'
import { turmas } from '@/src/db/schemas'
import { getProfessorAutenticado } from '@/src/lib/auth'
import { revalidatePath } from 'next/cache'

export async function criarTurma(formData: FormData) {
  const professor = await getProfessorAutenticado()

  if (!professor) {
    return { success: false, error: 'Não autorizado.' }
  }

  const nome = (formData.get('nome') as string | null)?.trim() ?? ''
  const sala = (formData.get('sala') as string | null)?.trim() ?? ''

  if (!nome || !sala) {
    return { success: false, error: 'Nome da turma e sala são obrigatórios.' }
  }

  await db.insert(turmas).values({
    nome,
    sala,
    professorId: professor.id,
  })

  revalidatePath('/dashboard/professores')
  return { success: true, error: null }
}