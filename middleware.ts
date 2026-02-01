import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Prevenção de erro de variáveis de ambiente no build da Vercel
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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

  // Importante: getUser() é mais seguro que getSession() para middleware
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 1. DEFINIÇÃO DE ROTAS PÚBLICAS (Melhorado)
  const isLoginPage = pathname === '/login'
  const isRegisterPage = pathname === '/cadastro'
  const isAuthRoute = pathname.startsWith('/auth')
  const isRoot = pathname === '/'
  
  const isPublicRoute = isLoginPage || isRegisterPage || isAuthRoute || isRoot

  // 2. Lógica de Proteção:
  if (!user && !isPublicRoute) {
    // Redireciona para login mantendo a URL que o usuário tentou acessar como parâmetro
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // 3. Evitar Login/Cadastro Duplo:
  if (user && (isLoginPage || isRegisterPage)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Matcher otimizado para não processar arquivos estáticos e pastas internas
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}