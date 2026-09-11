'use server'

import { db } from '@/src/db'
import { turmas } from '@/src/db/schemas'
import { revalidatePath } from 'next/cache'

export async function criarTurma(formData: FormData) {
  const professorId = formData.get('professorId') as string

  await db.insert(turmas).values({
    nome: formData.get('nome') as string,
    sala: formData.get('sala') as string,
    professorId: professorId,
  })
  
  revalidatePath('/dashboard/professor')
}