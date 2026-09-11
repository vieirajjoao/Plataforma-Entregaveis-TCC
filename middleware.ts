import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. BLOQUEIO DE LOOP: Ignora requisições internas do Next.js e arquivos estáticos instantaneamente
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('/favicon.ico')
  ) {
    return NextResponse.next()
  }
  
  // Cria uma resposta base
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Atualiza os cookies da requisição e da resposta simultaneamente
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Verifica quem é o usuário ativo
  const { data: { user } } = await supabase.auth.getUser()

  // REGRA DE PROTEÇÃO DE ROTAS:
  // Se o usuário tentar acessar qualquer rota que comece com /dashboard e NÃO estiver logado...
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    // ...Redireciona ele de volta para a página inicial
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Se ele estiver logado, ou acessando uma rota pública (como o login), deixa passar normal
  return supabaseResponse
}

// O matcher define em quais caminhos o middleware deve rodar.
// Aqui, ele roda em tudo, exceto arquivos estáticos (imagens, css, etc)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}