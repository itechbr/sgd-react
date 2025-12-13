'use client'

import { useState, useEffect } from 'react'
import { SecretarioService, ISecretario } from '@/app/services/secretarioService'
import { X, Save, AlertCircle } from 'lucide-react'

interface SecretarioFormProps {
  secretarioToEdit?: ISecretario | null
  onSuccess: () => void
  onCancel: () => void
}

export function SecretarioForm({ secretarioToEdit, onSuccess, onCancel }: SecretarioFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState<Partial<ISecretario>>({
    nome: '',
    siape: '',
    campus: 'João Pessoa',
    email: '',
    role: 'Secretário',
    ativo: true
  })

  useEffect(() => {
    if (secretarioToEdit) {
      setFormData(secretarioToEdit)
    }
  }, [secretarioToEdit])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!formData.nome || !formData.email || !formData.siape) {
        throw new Error('Preencha os campos obrigatórios.')
      }

      if (secretarioToEdit?.id) {
        await SecretarioService.update(secretarioToEdit.id, formData)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...newSecretario } = formData as ISecretario
        await SecretarioService.create(newSecretario)
      }
      onSuccess()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erro ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#1F1F1F] rounded-lg border border-[#333333] w-full max-w-lg mx-auto shadow-2xl relative flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-[#333333] bg-[#1A1A1A] rounded-t-lg">
        <h3 className="text-xl font-semibold text-[#C0A040]">
          {secretarioToEdit ? 'Editar Usuário' : 'Novo Usuário'}
        </h3>
        <button onClick={onCancel} className="text-[#AAAAAA] hover:text-white transition">
          <X size={24} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-200 p-3 rounded flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm text-[#AAAAAA] mb-1">Nome Completo *</label>
          <input name="nome" value={formData.nome} onChange={handleChange} required className="input-dark" placeholder="Ex: Maria Souza" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#AAAAAA] mb-1">SIAPE *</label>
            <input name="siape" value={formData.siape} onChange={handleChange} required className="input-dark" />
          </div>
          <div>
            <label className="block text-sm text-[#AAAAAA] mb-1">Campus *</label>
            <select name="campus" value={formData.campus} onChange={handleChange} className="input-dark">
              <option value="João Pessoa">João Pessoa</option>
              <option value="Campina Grande">Campina Grande</option>
              <option value="Cajazeiras">Cajazeiras</option>
              <option value="Reitoria">Reitoria</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#AAAAAA] mb-1">E-mail Institucional *</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required className="input-dark" />
        </div>

        <div className="pt-4 border-t border-[#333333]">
          <label className="block text-sm text-[#C0A040] font-semibold mb-2">Nível de Acesso</label>
          <select name="role" value={formData.role} onChange={handleChange} className="input-dark mb-4">
            <option value="Secretário">Secretário (Operacional)</option>
            <option value="Coordenador">Coordenador (Administrativo)</option>
          </select>

          <label className="flex items-center p-3 rounded border border-[#333333] bg-black/20 cursor-pointer hover:border-[#C0A040]/50 transition">
            <input 
              type="checkbox" 
              name="ativo" 
              checked={formData.ativo} 
              onChange={handleChange} 
              className="w-5 h-5 accent-[#C0A040] bg-[#121212] border-[#333333] rounded" 
            />
            <div className="ml-3">
              <span className="text-sm font-medium text-[#E0E0E0]">Conta Ativa</span>
              <p className="text-xs text-[#AAAAAA]">Usuário pode fazer login no sistema.</p>
            </div>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#333333] mt-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded border border-[#333333] text-[#E0E0E0] hover:bg-[#333333] transition">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2 rounded bg-[#C0A040] text-black font-bold hover:bg-[#E6C850] transition disabled:opacity-50 flex items-center">
            {loading ? 'Salvando...' : (
              <>
                <Save size={18} className="mr-2" />
                Salvar
              </>
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .input-dark {
            width: 100%;
            background-color: #121212;
            border: 1px solid #333333;
            color: #E0E0E0;
            padding: 0.5rem 0.75rem;
            border-radius: 0.375rem;
            outline: none;
            transition: border-color 0.2s;
        }
        .input-dark:focus {
            border-color: #C0A040;
        }
      `}</style>
    </div>
  )
}