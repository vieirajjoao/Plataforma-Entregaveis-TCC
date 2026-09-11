// Esse é um "mock" (simulação) temporário para o erro sumir.
// Na próxima etapa, vamos substituir isso pela leitura real do cookie do Supabase.
export async function getSessaoAtual() {
  return { 
    tipo: 'professor', // simula que um professor está logado
    usuarioId: 'fake-id-123' 
  }
}