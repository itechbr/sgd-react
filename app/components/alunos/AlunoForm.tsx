'use client'

import { useState, useEffect } from 'react'
import { AlunoService, IAlunoCompleto } from '@/app/services/alunoService'
import { ProfessorService } from '@/app/services/professorService'
import { IProfessor, IAluno, IDefesa } from '@/app/type/index'
import { X, Save, AlertCircle, GraduationCap, User } from 'lucide-react'

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

  // Estado da Defesa (Agora com Resumo)
  const [defesaData, setDefesaData] = useState<Partial<IDefesa>>({
    titulo: '',
    local: 'Auditório do IFPB',
    data: '',
    horario: '',
    resumo: '', // Campo novo adicionado
    status: 'Agendada',
    banca: [] 
  })
  
  // Estado auxiliar para membros da banca (string separada por vírgula no input)
  const [bancaInput, setBancaInput] = useState('')

  // Carregar dados iniciais
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Carrega Professores
        const profs = await ProfessorService.getAll()
        setProfessores(profs.filter(p => p.ativo)) // Apenas ativos

        // 2. Se for edição, preenche os campos
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
                // @ts-ignore - Garantindo que leia os campos mesmo se o tipo variar
                titulo: alunoToEdit.defesas.titulo || '',
                local: alunoToEdit.defesas.local || '',
                data: alunoToEdit.defesas.data || '',
                horario: alunoToEdit.defesas.horario || '',
                resumo: alunoToEdit.defesas.resumo || '', // Carrega o resumo
                status: alunoToEdit.defesas.status || 'Agendada',
                banca: alunoToEdit.defesas.banca || []
            })
            
            // Converte array de banca para string editável
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

  // Handlers de Input
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
      // Validação Simples
      if (!alunoData.nome || !alunoData.matricula || !alunoData.orientador_id) {
        throw new Error('Preencha os campos obrigatórios do Aluno (Nome, Matrícula, Orientador).')
      }

      // Prepara a banca (transforma string em array)
      const bancaArray = bancaInput.split(',').map(s => s.trim()).filter(s => s !== '')
      const defesaFinal = { ...defesaData, banca: bancaArray }

      if (alunoToEdit?.id) {
        // Atualizar
        await AlunoService.update(alunoToEdit.id, alunoData, defesaFinal)
      } else {
        // Criar
        await AlunoService.create(alunoData, defesaFinal)
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
      {/* Header do Modal */}
      <div className="flex justify-between items-center p-6 border-b border-[#333333]">
        <h2 className="text-xl font-bold text-[#C0A040]">
            {alunoToEdit ? 'Editar Aluno & Defesa' : 'Novo Cadastro de Aluno'}
        </h2>
        <button onClick={onCancel} className="text-[#AAAAAA] hover:text-white transition">
            <X size={24} />
        </button>
      </div>

      {/* Tabs de Navegação */}
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

      {/* Corpo do Formulário (Scrollável) */}
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
        {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-200 p-3 rounded mb-6 flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            {error}
            </div>
        )}

        <form id="aluno-form" onSubmit={handleSubmit}>
            {/* --- ABA 1: ALUNO --- */}
            <div className={activeTab === 'aluno' ? 'block space-y-4' : 'hidden'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-[#AAAAAA] mb-1">Nome Completo *</label>
                        <input name="nome" value={alunoData.nome} onChange={handleAlunoChange} required className="input-dark" />
                    </div>
                    <div>
                        <label className="block text-sm text-[#AAAAAA] mb-1">Matrícula *</label>
                        <input name="matricula" value={alunoData.matricula} onChange={handleAlunoChange} required className="input-dark" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-[#AAAAAA] mb-1">E-mail</label>
                        <input name="email" type="email" value={alunoData.email} onChange={handleAlunoChange} required className="input-dark" />
                    </div>
                    <div>
                        <label className="block text-sm text-[#AAAAAA] mb-1">Orientador *</label>
                        <select 
                            name="orientador_id" 
                            value={alunoData.orientador_id || ''} 
                            onChange={handleAlunoChange} 
                            required 
                            className="input-dark"
                            disabled={loadingProfs}
                        >
                            <option value="">Selecione um Professor...</option>
                            {professores.map(p => (
                                <option key={p.id} value={p.id}>{p.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-[#AAAAAA] mb-1">Curso</label>
                        <select name="curso" value={alunoData.curso} onChange={handleAlunoChange} className="input-dark">
                            <option value="Mestrado">Mestrado</option>
                            <option value="Doutorado">Doutorado</option>
                            <option value="Especialização">Especialização</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-[#AAAAAA] mb-1">Ano Ingresso</label>
                        <input name="ingresso" type="number" value={alunoData.ingresso} onChange={handleAlunoChange} className="input-dark" />
                    </div>
                    <div>
                        <label className="block text-sm text-[#AAAAAA] mb-1">Status Atual</label>
                        <select name="status" value={alunoData.status} onChange={handleAlunoChange} className="input-dark">
                            <option value="Ativo">Ativo</option>
                            <option value="Qualificado">Qualificado</option>
                            <option value="Defendido">Defendido</option>
                            <option value="Trancado">Trancado</option>
                            <option value="Desligado">Desligado</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* --- ABA 2: DEFESA --- */}
            <div className={activeTab === 'defesa' ? 'block space-y-4' : 'hidden'}>
                <div className="bg-[#121212] p-4 rounded border border-[#333333] mb-4">
                    <p className="text-sm text-[#AAAAAA]">Preencha apenas se a defesa já estiver prevista.</p>
                </div>

                <div>
                    <label className="block text-sm text-[#AAAAAA] mb-1">Título da Dissertação/Tese</label>
                    <input name="titulo" value={defesaData.titulo} onChange={handleDefesaChange} className="input-dark" placeholder="Título provisório ou final..." />
                </div>
                
                {/* --- CAMPO NOVO: RESUMO --- */}
                <div>
                    <label className="block text-sm text-[#AAAAAA] mb-1">Resumo / Abstract</label>
                    <textarea 
                        name="resumo" 
                        value={defesaData.resumo || ''} 
                        onChange={handleDefesaChange} 
                        className="input-dark min-h-[100px]" 
                        placeholder="Breve resumo do trabalho..." 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-[#AAAAAA] mb-1">Data</label>
                        <input name="data" type="date" value={defesaData.data} onChange={handleDefesaChange} className="input-dark" />
                    </div>
                    <div>
                        <label className="block text-sm text-[#AAAAAA] mb-1">Horário</label>
                        <input name="horario" type="time" value={defesaData.horario} onChange={handleDefesaChange} className="input-dark" />
                    </div>
                    <div>
                        <label className="block text-sm text-[#AAAAAA] mb-1">Status da Defesa</label>
                        <select name="status" value={defesaData.status} onChange={handleDefesaChange} className="input-dark">
                            <option value="Agendada">Agendada</option>
                            <option value="Realizada">Realizada</option>
                            <option value="Cancelada">Cancelada</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-[#AAAAAA] mb-1">Local</label>
                    <input name="local" value={defesaData.local} onChange={handleDefesaChange} className="input-dark" />
                </div>

                <div>
                    <label className="block text-sm text-[#AAAAAA] mb-1">Banca Examinadora (Separe nomes por vírgula)</label>
                    <input 
                        value={bancaInput} 
                        onChange={(e) => setBancaInput(e.target.value)} 
                        className="input-dark" 
                        placeholder="Ex: Prof. Dr. João, Prof. Dra. Maria..." 
                    />
                </div>
            </div>
        </form>
      </div>

      {/* Footer com Botões */}
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