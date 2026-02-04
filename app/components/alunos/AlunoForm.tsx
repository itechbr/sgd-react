'use client'

import { useState, useEffect } from 'react'
import { AlunoService, IAlunoCompleto } from '@/app/services/alunoService'
import { ProfessorService } from '@/app/services/professorService'
import { IProfessor, IAluno, IDefesa } from '@/app/type/index'
import { X, Save, AlertCircle, GraduationCap, User } from 'lucide-react'
import { FormInput } from '../ui/FormInput'
import { FormSelect } from '../ui/FormSelect'

interface AlunoFormProps {
  alunoToEdit?: IAlunoCompleto | null
  onSuccess: () => void
  onCancel: () => void
}

export function AlunoForm({ alunoToEdit, onSuccess, onCancel }: AlunoFormProps) {
  const [loading, setLoading] = useState(false)
  const [loadingProfs, setLoadingProfs] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'aluno' | 'defesa'>('aluno')

  // Listas para Selects
  const [professores, setProfessores] = useState<IProfessor[]>([])

  // Estado do Aluno
  const [alunoData, setAlunoData] = useState<Partial<IAluno>>({
    nome: '',
    matricula: '',
    email: '',
    curso: 'Mestrado',
    ingresso: new Date().getFullYear(),
    status: 'Ativo',
    ativo: true,
    orientador_id: undefined
  })

  // Estado da Defesa
  const [defesaData, setDefesaData] = useState<Partial<IDefesa>>({
    titulo: '',
    local: 'Auditório do IFPB',
    data: '',
    horario: '',
    resumo: '',
    status: 'Agendada',
    banca: [] 
  })
  
  const [bancaInput, setBancaInput] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const profs = await ProfessorService.getAll()
        setProfessores(profs.filter(p => p.ativo))

        if (alunoToEdit) {
          setAlunoData({
            nome: alunoToEdit.nome,
            matricula: alunoToEdit.matricula,
            email: alunoToEdit.email,
            curso: alunoToEdit.curso,
            ingresso: alunoToEdit.ingresso,
            status: alunoToEdit.status,
            ativo: alunoToEdit.ativo,
            orientador_id: alunoToEdit.orientador_id
          })

          if (alunoToEdit.defesas) {
            setDefesaData({
                // @ts-ignore
                titulo: alunoToEdit.defesas.titulo || '',
                local: alunoToEdit.defesas.local || '',
                data: alunoToEdit.defesas.data || '',
                horario: alunoToEdit.defesas.horario || '',
                resumo: alunoToEdit.defesas.resumo || '',
                status: alunoToEdit.defesas.status || 'Agendada',
                banca: alunoToEdit.defesas.banca || []
            })
            
            if (alunoToEdit.defesas.banca && Array.isArray(alunoToEdit.defesas.banca)) {
                setBancaInput(alunoToEdit.defesas.banca.join(', '))
            }
          }
        }
      } catch (err) {
        console.error(err)
        setError('Erro ao carregar dados iniciais.')
      } finally {
        setLoadingProfs(false)
      }
    }
    loadData()
  }, [alunoToEdit])

  const handleAlunoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAlunoData(prev => ({ ...prev, [name]: value }))
  }

  const handleDefesaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDefesaData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Validação de Campos Obrigatórios
      if (!alunoData.nome || !alunoData.matricula || !alunoData.email || !alunoData.orientador_id) {
        throw new Error('Preencha os campos obrigatórios do Aluno (Nome, Matrícula, E-mail, Orientador).')
      }

      // 2. Validação Regexp (Segurança Extra no Submit)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(alunoData.email)) {
        throw new Error('O e-mail informado é inválido.')
      }

      const matriculaRegex = /^\d+$/
      if (!matriculaRegex.test(alunoData.matricula)) {
        throw new Error('A matrícula deve conter apenas números.')
      }

      const bancaArray = bancaInput.split(',').map(s => s.trim()).filter(s => s !== '')
      const defesaFinal = { ...defesaData, banca: bancaArray }

      if (alunoToEdit?.id) {
        await AlunoService.update(alunoToEdit.id, alunoData, defesaFinal)
      } else {
        await AlunoService.create(alunoData as IAluno, defesaFinal)
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
    <div className="bg-[#1F1F1F] rounded-lg border border-[#333333] w-full max-w-4xl mx-auto shadow-2xl relative flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-[#333333]">
        <h2 className="text-xl font-bold text-[#C0A040]">
            {alunoToEdit ? 'Editar Aluno & Defesa' : 'Novo Cadastro de Aluno'}
        </h2>
        <button onClick={onCancel} className="text-[#AAAAAA] hover:text-white transition">
            <X size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#333333] bg-[#121212]">
        <button
            type="button"
            onClick={() => setActiveTab('aluno')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'aluno' ? 'text-[#C0A040] border-b-2 border-[#C0A040] bg-[#1F1F1F]' : 'text-[#AAAAAA] hover:text-[#E0E0E0]'
            }`}
        >
            <User size={18} /> Dados Acadêmicos
        </button>
        <button
            type="button"
            onClick={() => setActiveTab('defesa')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'defesa' ? 'text-[#C0A040] border-b-2 border-[#C0A040] bg-[#1F1F1F]' : 'text-[#AAAAAA] hover:text-[#E0E0E0]'
            }`}
        >
            <GraduationCap size={18} /> Dados da Defesa
        </button>
      </div>

      {/* Conteúdo */}
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
        {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-200 p-3 rounded mb-6 flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            {error}
            </div>
        )}

        <form id="aluno-form" onSubmit={handleSubmit}>
            {/* --- ABA 1: ALUNO --- */}
            <div className={activeTab === 'aluno' ? 'block' : 'hidden'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput 
                        label="Nome Completo" 
                        name="nome" 
                        value={alunoData.nome} 
                        onChange={handleAlunoChange} 
                        required 
                    />
                    {/* Validação: Apenas números */}
                    <FormInput 
                        label="Matrícula" 
                        name="matricula" 
                        value={alunoData.matricula} 
                        onChange={handleAlunoChange} 
                        required 
                        validation={{
                          regex: /^\d+$/,
                          message: 'A matrícula deve conter apenas números.'
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Validação: Formato de Email */}
                    <FormInput 
                        label="E-mail" 
                        name="email" 
                        type="email" 
                        value={alunoData.email} 
                        onChange={handleAlunoChange} 
                        required 
                        validation={{
                          regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Insira um e-mail válido.'
                        }}
                    />
                    <FormSelect 
                        label="Orientador"
                        name="orientador_id"
                        value={alunoData.orientador_id || ''}
                        onChange={handleAlunoChange}
                        required
                        disabled={loadingProfs}
                        options={professores.map(p => ({ value: p.id, label: p.nome }))}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormSelect 
                        label="Curso"
                        name="curso"
                        value={alunoData.curso}
                        onChange={handleAlunoChange}
                        options={[
                            { value: 'Mestrado', label: 'Mestrado' },
                            { value: 'Doutorado', label: 'Doutorado' },
                            { value: 'Especialização', label: 'Especialização' }
                        ]}
                    />
                    <FormInput 
                        label="Ano Ingresso" 
                        name="ingresso" 
                        type="number" 
                        value={alunoData.ingresso} 
                        onChange={handleAlunoChange} 
                    />
                    <FormSelect 
                        label="Status Atual"
                        name="status"
                        value={alunoData.status}
                        onChange={handleAlunoChange}
                        options={[
                            { value: 'Ativo', label: 'Ativo' },
                            { value: 'Qualificado', label: 'Qualificado' },
                            { value: 'Defendido', label: 'Defendido' },
                            { value: 'Trancado', label: 'Trancado' },
                            { value: 'Desligado', label: 'Desligado' }
                        ]}
                    />
                </div>
            </div>

            {/* --- ABA 2: DEFESA --- */}
            <div className={activeTab === 'defesa' ? 'block' : 'hidden'}>
                <div className="bg-[#121212] p-4 rounded border border-[#333333] mb-6">
                    <p className="text-sm text-[#AAAAAA]">Preencha apenas se a defesa já estiver prevista.</p>
                </div>

                <FormInput 
                    label="Título da Dissertação/Tese"
                    name="titulo"
                    value={defesaData.titulo}
                    onChange={handleDefesaChange}
                    placeholder="Título provisório ou final..."
                />
                
                <div className="w-full mb-4">
                    <label className="block text-sm font-medium text-[#AAAAAA] mb-1.5">Resumo / Abstract</label>
                    <textarea 
                        name="resumo" 
                        value={defesaData.resumo || ''} 
                        onChange={handleDefesaChange} 
                        className="w-full px-4 py-2.5 bg-[#1F1F1F] border border-[#333333] rounded-lg text-[#E0E0E0] placeholder-[#555555] focus:outline-none focus:ring-1 focus:ring-[#C0A040] focus:border-[#C0A040] transition-all duration-200 min-h-[100px]"
                        placeholder="Breve resumo do trabalho..." 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput 
                        label="Data" 
                        name="data" 
                        type="date" 
                        value={defesaData.data} 
                        onChange={handleDefesaChange} 
                    />
                    <FormInput 
                        label="Horário" 
                        name="horario" 
                        type="time" 
                        value={defesaData.horario} 
                        onChange={handleDefesaChange} 
                    />
                    <FormSelect 
                        label="Status da Defesa"
                        name="status"
                        value={defesaData.status}
                        onChange={handleDefesaChange}
                        options={[
                            { value: 'Agendada', label: 'Agendada' },
                            { value: 'Realizada', label: 'Realizada' },
                            { value: 'Cancelada', label: 'Cancelada' }
                        ]}
                    />
                </div>

                <FormInput 
                    label="Local" 
                    name="local" 
                    value={defesaData.local} 
                    onChange={handleDefesaChange} 
                />

                <FormInput 
                    label="Banca Examinadora" 
                    value={bancaInput} 
                    onChange={(e) => setBancaInput(e.target.value)} 
                    placeholder="Ex: Prof. Dr. João, Prof. Dra. Maria (separe por vírgula)"
                    helperText="Separe os nomes dos membros por vírgula"
                />
            </div>
        </form>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-[#333333] flex justify-between bg-[#121212] rounded-b-lg">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded border border-[#333333] text-[#E0E0E0] hover:bg-[#333333] transition">
            Cancelar
        </button>
        <button 
            type="submit" 
            form="aluno-form"
            disabled={loading}
            className="px-6 py-2 rounded bg-[#C0A040] text-black font-bold hover:bg-[#E6C850] transition disabled:opacity-50 flex items-center"
        >
            {loading ? 'Salvando...' : (
                <>
                    <Save size={18} className="mr-2" />
                    Salvar Tudo
                </>
            )}
        </button>
      </div>
    </div>
  )
}