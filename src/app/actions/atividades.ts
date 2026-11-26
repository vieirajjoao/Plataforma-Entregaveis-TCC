'use server'

import { db } from '@/src/db'
import { atividades } from '@/src/db/schemas'
import { getAlunoAutenticado } from '@/src/lib/auth'
import { createAdminClient } from '@/src/lib/supabase'
import { revalidatePath } from 'next/cache'

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export async function submeterAtividade(formData: FormData) {
  const aluno = await getAlunoAutenticado()

  if (!aluno || !aluno.ativo) {
    return { success: false, error: 'Não autorizado.' }
  }

  if (aluno.precisaTrocarSenha) {
    return { success: false, error: 'Altere sua senha temporária antes de realizar envios.' }
  }

  const titulo = (formData.get('titulo') as string | null)?.trim() ?? ''
  const descricao = (formData.get('descricao') as string | null)?.trim() ?? ''
  const arquivos = formData.getAll('arquivos') as File[]

  if (!titulo || !descricao) {
    return { success: false, error: 'Título e descrição são obrigatórios.' }
  }

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
    'image/jpeg',
    'image/png',
  ]

  const supabase = createAdminClient()
  const arquivosSalvos: { nome: string; url: string }[] = []

  for (const arquivo of arquivos) {
    if (arquivo.size === 0) continue

    if (arquivo.size > MAX_FILE_SIZE_BYTES) {
      return { success: false, error: `O arquivo "${arquivo.name}" excede o limite de 10 MB.` }
    }

    if (!allowedTypes.includes(arquivo.type)) {
      return { success: false, error: `Formato não suportado: "${arquivo.name}".` }
    }

    const nomeSeguro = arquivo.name.replace(/[^a-zA-Z0-9.\-]/g, '_')
    const path = `envios-${aluno.id}-${Date.now()}-${nomeSeguro}`

    const { data, error } = await supabase.storage.from('tcc-arquivos').upload(path, arquivo)
    if (error) return { success: false, error: 'Erro ao fazer upload do anexo.' }

    const fileUrl = supabase.storage.from('tcc-arquivos').getPublicUrl(data.path).data.publicUrl
    arquivosSalvos.push({ nome: arquivo.name, url: fileUrl })
  }

  await db.insert(atividades).values({
    alunoId: aluno.id,
    titulo,
    descricao,
    arquivos: arquivosSalvos,
  })

  revalidatePath('/dashboard/aluno')
  return { success: true, error: null }
}