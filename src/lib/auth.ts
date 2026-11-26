import { db } from '@/src/db'
import { alunos } from '@/src/db/schemas/alunos'
import { professores } from '@/src/db/schemas/professores'
import { createClientSSR } from '@/src/lib/supabase'
import { eq } from 'drizzle-orm'

export async function getProfessorAutenticado() {
  const supabase = await createClientSSR()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const [professor] = await db
    .select()
    .from(professores)
    .where(eq(professores.authUserId, user.id))
    .limit(1)

  return professor ?? null
}

export async function getAlunoAutenticado() {
  const supabase = await createClientSSR()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const [aluno] = await db
    .select()
    .from(alunos)
    .where(eq(alunos.authUserId, user.id))
    .limit(1)

  return aluno ?? null
}