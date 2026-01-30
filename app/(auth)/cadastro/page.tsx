'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { User, Lock, Mail, Hash, Phone, Briefcase } from 'lucide-react'
import { FormInput } from '@/app/components/ui/FormInput'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    registration: '',
    phone: '',
    role: 'aluno'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const emailClean = formData.email.trim().toLowerCase()
    
    // 1. VALIDAÇÃO DE DOMÍNIO INSTITUCIONAL
    const emailRegex = /^[a-zA-Z0-9._%+-]+@ifpb\.edu\.br$/
    
    if (!emailRegex.test(emailClean)) {
      setError('É obrigatório o uso de um e-mail institucional (@ifpb.edu.br) para o cadastro.')
      setLoading(false)
      return
    }

    // 2. VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS
    if (!formData.fullName || !formData.password || !formData.registration) {
      setError('Por favor, preencha todos os campos obrigatórios.')
      setLoading(false)
      return
    }

    try {
      // 3. Cria o usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailClean,
        password: formData.password,
      })

      if (authError) throw authError

      // 4. Insere na tabela Profiles
      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: authData.user.id,
            full_name: formData.fullName,
            email: emailClean,
            registration_number: formData.registration,
            phone: formData.phone,
            role: formData.role
          }
        ])

        if (profileError) throw profileError
        
        alert('Solicitação enviada com sucesso! Aguarde a aprovação de um coordenador.')
        router.push('/login')
      }
    } catch (err: unknown) {
      console.error('Erro no cadastro:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Erro inesperado ao criar conta.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-black text-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#121212] px-8 py-10 rounded-xl border border-[#333333] shadow-2xl shadow-[#C0A040]/10">
        <h2 className="text-[#C0A040] text-3xl font-semibold mb-6 text-center">Criar Conta</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <FormInput
            label="Nome Completo"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            placeholder="Seu nome"
            startIcon={<User size={18} />}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="E-mail Institucional"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="user@ifpb.edu.br"
              startIcon={<Mail size={18} />}
            />
            <FormInput
              label="Matrícula"
              value={formData.registration}
              onChange={(e) => setFormData({...formData, registration: e.target.value})}
              placeholder="Matrícula"
              startIcon={<Hash size={18} />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Celular"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="(83) 9..."
              startIcon={<Phone size={18} />}
            />
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-400">Tipo de Usuário</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg py-2.5 pl-10 text-gray-200 focus:border-[#C0A040] outline-none appearance-none"
                >
                  <option value="aluno">Aluno</option>
                  <option value="professor">Professor</option>
                  <option value="secretario">Secretário</option>
                  <option value="coordenador">Coordenador</option>
                </select>
              </div>
            </div>
          </div>

          <FormInput
            label="Senha"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            startIcon={<Lock size={18} />}
          />

          {error && <div className="text-red-400 text-xs p-2 bg-red-900/20 border border-red-900/50 rounded">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C0A040] text-black py-3 text-lg font-bold rounded-lg hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Enviar Solicitação'}
          </button>

          <div className="mt-8 text-center border-t border-[#333333] pt-6">
            <Link href="/login" className="text-[#C0A040] font-bold hover:underline">
              Fazer login no sistema
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}