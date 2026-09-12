'use server'

import { db } from '@/src/db'
import { atividades } from '@/src/db/schemas'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function submeterAtividade(formData: FormData) {
  const alunoId = formData.get('alunoId') as string
  const titulo = formData.get('titulo') as string
  const descricao = formData.get('descricao') as string
  const arquivos = formData.getAll('arquivos') as File[] // Captura múltiplos arquivos

  if (!titulo || !descricao) {
    return { success: false, error: 'Título e descrição são obrigatórios.' }
  }

  const allowedTypes = [
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'text/markdown', 'image/jpeg', 'image/png'
  ]

  const arquivosSalvos: { nome: string, url: string }[] = []

  // Itera sobre todos os arquivos enviados
  for (const arquivo of arquivos) {
    if (arquivo.size === 0) continue

    if (!allowedTypes.includes(arquivo.type)) {
      return { success: false, error: `Formato não suportado.` }
    }

    const nomeSeguro = arquivo.name.replace(/[^a-zA-Z0-9.\-]/g, '_')
    const path = `envios-${alunoId}-${Date.now()}-${nomeSeguro}`

    const { data, error } = await supabase.storage.from('tcc-arquivos').upload(path, arquivo)
    if (error) return { success: false, error: `Erro no upload.` }

    const fileUrl = supabase.storage.from('tcc-arquivos').getPublicUrl(data.path).data.publicUrl
    
    arquivosSalvos.push({ nome: arquivo.name, url: fileUrl })
  }

  await db.insert(atividades).values({
    alunoId,
    titulo,
    descricao,
    arquivos: arquivosSalvos
  })

  revalidatePath('/dashboard/aluno')
  return { success: true, error: null }
}