'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, User, Lock } from 'lucide-react'
import { FormInput } from '@/app/components/ui/FormInput'
import Link from 'next/link'

export default function LoginPage() {
  const [login, setLogin] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const emailClean = login.trim().toLowerCase()
    
    // 1. VALIDAÇÃO DE FORMATO E DOMÍNIO (A mensagem que você queria)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]*\.)?ifpb\.edu\.br$/
    if (!emailRegex.test(emailClean)) {
      setError('Por favor, utilize seu e-mail institucional do IFPB para acessar o sistema.')
      setIsLoading(false)
      return
    }

    if (!password) {
      setError('A senha é obrigatória.')
      setIsLoading(false)
      return
    }

    try {
      // 2. Tenta autenticação no Auth
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email: emailClean, 
        password,
      })

      if (authError) {
        // Se o e-mail existe mas a senha errou, ou o Supabase barrou
        setError('E-mail ou senha incorretos.')
        setIsLoading(false)
        return
      }

      // 3. Busca o perfil para verificar aprovação
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', user?.id)
        .single()

      if (pError || !profile) {
        setError('Erro ao validar perfil. Contate o suporte.')
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      // 4. Validação de Status (Pendente/Recusado)
      if (profile.status === 'pendente') {
        setError('Sua solicitação de cadastro ainda está em análise pela coordenação.')
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      if (profile.status === 'recusado') {
        setError('Sua solicitação foi recusada.')
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      router.push('/dashboard') 

    } catch (catchErr) {
      setError('Erro ao conectar ao servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-black text-gray-200 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-[#121212] px-8 py-10 rounded-xl border border-[#333333] text-center shadow-2xl shadow-[#C0A040]/20">
        <img src="/logo_sgd.webp" alt="Logo" className="w-28 h-28 mb-6 rounded-full mx-auto border-2 border-[#C0A040]/30" />
        <h2 className="text-[#C0A040] text-3xl font-semibold mb-8">Acessar o Sistema</h2>
        
        <form onSubmit={handleLogin} className="text-left">
          <FormInput
            label="E-mail"
            type="email"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="seu@email.ifpb.edu.br"
            startIcon={<User size={20} />}
          />

          <FormInput
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startIcon={<Lock size={20} />}
            endIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />
          
          {error && (
            <div className="text-red-400 text-sm mb-6 text-center bg-red-900/20 p-2 rounded border border-red-900/50">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#C0A040] text-black py-3 text-lg font-extrabold rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Processando...' : 'Entrar'}
          </button>

          <div className="mt-8 text-center border-t border-[#333333] pt-6">
            <p className="text-gray-400 text-sm">Não possui acesso?</p>
            <Link href="/cadastro" className="text-[#C0A040] font-bold hover:underline mt-1 inline-block">
              Solicitar cadastro institucional
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}