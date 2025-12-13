'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, User, Lock } from 'lucide-react'

export default function LoginPage() {
  const [login, setLogin] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!login || !password) {
      setError('Preencha todos os campos.')
      return
    }

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: login, 
        password,
      })

      if (authError) {
        setError('Credenciais inválidas. Tente novamente.')
        console.error('Supabase Auth Error:', authError.message)
        return
      }

      router.push('/dashboard') 

    } catch (err) {
      console.error(err)
      setError('Ocorreu um erro inesperado.')
    }
  }

  return (
    <div className="min-h-screen w-full bg-black text-gray-200 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-[#121212] px-8 py-10 rounded-xl border border-[#333333] text-center shadow-2xl shadow-[#C0A040]/20">
            
            {/* Logo - Certifique-se que logo_sgd.webp está na pasta public/ */}
            <img 
              src="/logo_sgd.webp" 
              alt="Logo do SGD" 
              className="w-28 h-28 mb-6 object-cover rounded-full mx-auto border-2 border-[#C0A040]/30" 
            />
            
            <h2 className="text-[#C0A040] text-3xl font-semibold mb-8">Acessar o Sistema</h2>
            
            <form onSubmit={handleLogin} className="login-form text-left">
                <div className="mb-5">
                    <label htmlFor="username" className="block mb-2 text-sm text-[#AAAAAA]">E-mail</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="username"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="w-full pl-10 p-3 bg-[#1F1F1F] border border-[#333333] rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#C0A040] focus:ring-1 focus:ring-[#C0A040]"
                            placeholder="seu@email.com"
                        />
                    </div>
                </div>
                
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm text-[#AAAAAA]">Senha</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 p-3 pr-10 bg-[#1F1F1F] border border-[#333333] rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#C0A040] focus:ring-1 focus:ring-[#C0A040]"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 p-1 hover:text-white"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                
                {error && (
                    <div className="text-red-400 text-sm mb-4 text-center bg-red-900/20 p-2 rounded border border-red-900/50">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-[#C0A040] text-black py-3 text-lg font-extrabold rounded-lg shadow-lg hover:brightness-110 transition-all"
                >
                    Entrar
                </button>
            </form>
        </div>
    </div>
  )
}