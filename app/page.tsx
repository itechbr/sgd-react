import { redirect } from 'next/navigation'

export default function Home() {
  // Se o usuário acessar a raiz, mandamos para o dashboard.
  // O Middleware vai interceptar:
  // - Se não logado: manda para /login
  // - Se logado: deixa passar para /dashboard
  redirect('/dashboard')
}