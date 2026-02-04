'use client'

import { useState, useEffect } from 'react'
import { ProfessorService } from '@/app/services/professorService'
import { IProfessor } from '@/app/type/index' 
import { X, Save, AlertCircle } from 'lucide-react'
// Importando validações e componentes padrão
import { FormInput, INPUT_VALIDATIONS } from '../ui/FormInput'
import { FormSelect } from '../ui/FormSelect'

interface ProfessorFormProps {
  professorToEdit?: IProfessor | null
  onSuccess: () => void
  onCancel: () => void
}

export function ProfessorForm({ professorToEdit, onSuccess, onCancel }: ProfessorFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Estado inicial do formulário
  const [formData, setFormData] = useState<Partial<IProfessor>>({
    nome: '',
    email: '',
    lattes: '',
    instituicao: 'IFPB',
    titulacao: 'Doutorado',
    tipo: 'Permanente',
    areas: '',
    ativo: true
  })

  // Se houver um professor para editar, preenche o formulário
  useEffect(() => {
    if (professorToEdit) {
      setFormData(professorToEdit)
    }
  }, [professorToEdit])

  // Lógica para alterar campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    // Tratamento especial para checkbox
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      let newState = { ...formData, [name]: value }

      // Regra de Negócio: Se for Permanente, Instituição deve ser IFPB
      if (name === 'tipo' && value === 'Permanente') {
         newState.instituicao = 'IFPB'
      }
      setFormData(newState)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Validação de Campos Obrigatórios
      if (!formData.nome || !formData.email) {
        throw new Error('Nome e E-mail são obrigatórios.')
      }

      // 2. Validação de Formato (Regex Centralizado)
      if (!INPUT_VALIDATIONS.email.regex.test(formData.email)) {
        throw new Error('O e-mail informado é inválido.')
      }

      if (professorToEdit?.id) {
        // Modo Edição
        await ProfessorService.update(professorToEdit.id, formData)
      } else {
        // Modo Criação (Remove ID e created_at para inserção)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, created_at, ...newProfessor } = formData as IProfessor
        await ProfessorService.create(newProfessor)
      }

      onSuccess() // Fecha o modal e atualiza a lista
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erro ao salvar professor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#1F1F1F] p-6 rounded-lg border border-[#333333] w-full max-w-2xl mx-auto shadow-2xl relative">
      {/* Botão Fechar */}
      <button 
        onClick={onCancel}
        className="absolute top-4 right-4 text-[#AAAAAA] hover:text-white transition"
      >
        <X size={24} />
      </button>

      <h2 className="text-xl font-bold text-[#C0A040] mb-6">
        {professorToEdit ? 'Editar Professor' : 'Novo Professor'}
      </h2>

      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-200 p-3 rounded mb-4 flex items-center gap-2 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Linha 1: Nome e E-mail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput 
            label="Nome Completo" 
            name="nome" 
            value={formData.nome} 
            onChange={handleChange} 
            required 
          />
          <FormInput 
            label="E-mail Institucional" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            validation={INPUT_VALIDATIONS.email}
          />
        </div>

        {/* Linha 2: Lattes */}
        <FormInput 
          label="Link Lattes" 
          name="lattes" 
          value={formData.lattes || ''} 
          onChange={handleChange} 
          placeholder="http://lattes.cnpq.br/..." 
        />

        {/* Linha 3: Tipo, Instituição e Titulação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormSelect 
            label="Categoria"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
            options={[
              { value: 'Permanente', label: 'Permanente' },
              { value: 'Colaborador', label: 'Colaborador' },
              { value: 'Visitante', label: 'Visitante' }
            ]}
          />
          <FormInput 
            label="Instituição" 
            name="instituicao" 
            value={formData.instituicao} 
            onChange={handleChange}
            // Lógica mantida: desabilita visualmente se for Permanente
            readOnly={formData.tipo === 'Permanente'}
            className={formData.tipo === 'Permanente' ? 'opacity-50 cursor-not-allowed' : ''}
          />
          <FormSelect 
            label="Titulação"
            name="titulacao"
            value={formData.titulacao}
            onChange={handleChange}
            options={[
              { value: 'Doutorado', label: 'Doutorado' },
              { value: 'Mestrado', label: 'Mestrado' },
              { value: 'Especialização', label: 'Especialização' },
              { value: 'Graduação', label: 'Graduação' }
            ]}
          />
        </div>

        {/* Linha 4: Áreas e Ativo */}
        <FormInput 
          label="Áreas de Pesquisa" 
          name="areas" 
          value={formData.areas || ''} 
          onChange={handleChange} 
          placeholder="Ex: IA, Redes, Segurança..." 
        />

        <div className="flex items-center gap-2 pt-2 mb-6">
          <input
            type="checkbox"
            name="ativo"
            id="ativo"
            checked={formData.ativo}
            onChange={handleChange}
            className="w-4 h-4 accent-[#C0A040] bg-[#121212] border-[#333333] rounded cursor-pointer"
          />
          <label htmlFor="ativo" className="text-sm text-[#E0E0E0] cursor-pointer">
            Cadastro Ativo
          </label>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#333333]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded border border-[#333333] text-[#E0E0E0] hover:bg-[#333333] transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded bg-[#C0A040] text-black font-bold hover:bg-[#E6C850] transition disabled:opacity-50 flex items-center"
          >
            {loading ? 'Salvando...' : (
              <>
                <Save size={18} className="mr-2" />
                Salvar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}