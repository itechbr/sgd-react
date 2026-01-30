'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, User, Lock } from 'lucide-react'
import { FormInput } from '@/app/components/ui/FormInput' // Ajuste o import conforme sua estrutura

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
            
            <img 
              src="/logo_sgd.webp" 
              alt="Logo do SGD" 
              className="w-28 h-28 mb-6 object-cover rounded-full mx-auto border-2 border-[#C0A040]/30" 
            />
            
            <h2 className="text-[#C0A040] text-3xl font-semibold mb-8">Acessar o Sistema</h2>
            
            <form onSubmit={handleLogin} className="text-left">
                
                <FormInput
                    label="E-mail"
                    type="email"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="seu@email.com"
                    startIcon={<User size={20} />}
                />

                <FormInput
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    startIcon={<Lock size={20} />}
                    endIcon={
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-white focus:outline-none"
                        >
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
                    className="w-full bg-[#C0A040] text-black py-3 text-lg font-extrabold rounded-lg shadow-lg hover:brightness-110 transition-all mt-2"
                >
                    Entrar
                </button>
            </form>
        </div>
    </div>
  )
}