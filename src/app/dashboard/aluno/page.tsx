export const dynamic = 'force-dynamic'

import { db } from '@/src/db'
import { alunos, turmas, atividades } from '@/src/db/schemas'
import { eq, desc } from 'drizzle-orm'
import { createClientSSR } from '@/src/lib/supabase'
import { redirect } from 'next/navigation'
import FormularioEnvio from '@/src/components/FormularioEnvio'
import BotaoSair from '@/src/components/BotaoSair'

export default async function AlunoDashboard() {
  const supabase = await createClientSSR()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login/aluno')

  const resultadoAluno = await db.select().from(alunos).where(eq(alunos.authUserId, user.id)).limit(1)
  const aluno = resultadoAluno[0]
  if (!aluno) redirect('/login/aluno')

  const resultadoTurma = await db.select().from(turmas).where(eq(turmas.id, aluno.turmaId)).limit(1)
  const turma = resultadoTurma[0]

  const historicoEnvios = await db.select()
    .from(atividades)
    .where(eq(atividades.alunoId, aluno.id))
    .orderBy(desc(atividades.dataSubmissao))

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <header className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Olá, {aluno.nome}</h1>
            <p className="text-sm text-gray-500">Turma: {turma.nome} | {turma.sala}</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hidden md:block">
              Total de Envios: {historicoEnvios.length}
            </p>
            <BotaoSair /> {/* <-- BOTAO AQUI */}
          </div>
        </header>

        {/* COMPONENTE INTERATIVO IMPORTADO AQUI */}
        <FormularioEnvio alunoId={aluno.id} />

        {historicoEnvios.length > 0 && (
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <h2 className="text-lg font-semibold mb-4 text-gray-800">Meus Envios</h2>
             <div className="space-y-4">
               {historicoEnvios.map(envio => (
                 <div key={envio.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                   <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-lg text-gray-800">{envio.titulo}</h3>
                     <span className="text-gray-400 text-xs">
                       {envio.dataSubmissao.toLocaleDateString('pt-BR')} às {envio.dataSubmissao.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                     </span>
                   </div>
                   <p className="text-gray-600 mb-4 whitespace-pre-wrap">{envio.descricao}</p>
                   
                   {envio.arquivos && envio.arquivos.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-gray-200">
                       {envio.arquivos.map((arq, index) => (
                         <a 
                           key={index} 
                           href={arq.url} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="bg-white border border-gray-300 text-blue-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-50 transition"
                         >
                           📎 {arq.nome}
                         </a>
                       ))}
                     </div>
                   )}
                 </div>
               ))}
             </div>
          </section>
        )}

      </div>
    </main>
  )
}