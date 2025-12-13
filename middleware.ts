import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Cria uma resposta inicial que permite a continuação da requisição
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          // Atualiza os cookies na requisição e na resposta
          // Isso é crucial para manter a sessão (refresh token) ativa
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Verifica a sessão do usuário
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Lógica de Proteção de Rotas:
  // Se NÃO houver usuário E a rota NÃO for pública (login, cadastro, arquivos estáticos) -> Redireciona para Login
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/logo_sgd.webp') // Permite a logo no login
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se houver usuário E ele tentar acessar Login -> Redireciona para Dashboard (evita login duplo)
  if (user && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

// Configuração do Matcher: Onde o middleware deve rodar
export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos de solicitação, exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagem)
     * - favicon.ico (arquivo favicon)
     * - Imagens com extensões comuns (svg, png, jpg, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}